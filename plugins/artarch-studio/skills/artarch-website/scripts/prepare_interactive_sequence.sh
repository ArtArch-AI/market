#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <input-video> <output-dir> <asset-name> [frame-count] [max-width]\n' "$0" >&2
  exit 2
}

[[ $# -ge 3 && $# -le 5 ]] || usage

input=$1
output_dir=$2
asset_name=$3
frame_count=${4:-72}
max_width=${5:-1600}

[[ -f "$input" ]] || {
  printf 'Input video does not exist: %s\n' "$input" >&2
  exit 1
}

case "$asset_name" in
  *[!a-zA-Z0-9_-]*|'')
    printf 'asset-name may contain only letters, digits, underscore, and hyphen\n' >&2
    exit 1
    ;;
esac

case "$frame_count" in
  *[!0-9]*|'') usage ;;
esac
case "$max_width" in
  *[!0-9]*|'') usage ;;
esac

(( frame_count >= 2 && frame_count <= 240 )) || {
  printf 'frame-count must be between 2 and 240\n' >&2
  exit 1
}
(( max_width >= 320 && max_width <= 2400 )) || {
  printf 'max-width must be between 320 and 2400\n' >&2
  exit 1
}

for command_name in ffmpeg ffprobe jq; do
  command -v "$command_name" >/dev/null 2>&1 || {
    printf '%s is required\n' "$command_name" >&2
    exit 1
  }
done

frames_dir="$output_dir/$asset_name-frames"
manifest="$output_dir/$asset_name-sequence.json"

if [[ -e "$frames_dir" || -e "$manifest" ]]; then
  printf 'Output already exists for asset: %s\n' "$asset_name" >&2
  exit 1
fi

mkdir -p "$output_dir"
work_dir=$(mktemp -d "$output_dir/.${asset_name}.sequence.XXXXXX")
work_frames="$work_dir/$asset_name-frames"
work_manifest="$work_dir/$asset_name-sequence.json"
mkdir -p "$work_frames"

cleanup() {
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

duration=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$input")

fps=$(awk -v frames="$frame_count" -v duration="$duration" 'BEGIN {
  if (duration <= 0) exit 1;
  printf "%.8f", frames / duration;
}')

encoders=$(ffmpeg -hide_banner -encoders 2>/dev/null)
if grep -q '[[:space:]]libwebp[[:space:]]' <<<"$encoders"; then
  extension=webp
  encoder_args=(-c:v libwebp -quality 82 -compression_level 6)
else
  extension=jpg
  encoder_args=(-c:v mjpeg -q:v 4)
fi

ffmpeg -hide_banner -loglevel error -i "$input" -an \
  -vf "fps=$fps,scale='min($max_width,iw)':-2:flags=lanczos" \
  -frames:v "$frame_count" "${encoder_args[@]}" \
  "$work_frames/$asset_name-%04d.$extension"

produced=$(find "$work_frames" -maxdepth 1 -type f -name "$asset_name-*.$extension" | wc -l | tr -d ' ')
[[ "$produced" -eq "$frame_count" ]] || {
  printf 'Expected %s frames but produced %s\n' "$frame_count" "$produced" >&2
  exit 1
}

dimensions=$(ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height -of json "$work_frames/$asset_name-0001.$extension")
width=$(jq -r '.streams[0].width' <<<"$dimensions")
height=$(jq -r '.streams[0].height' <<<"$dimensions")

jq -n \
  --arg assetName "$asset_name" \
  --arg source "$(basename "$input")" \
  --arg directory "$(basename "$frames_dir")" \
  --arg pattern "$asset_name-%04d.$extension" \
  --arg format "$extension" \
  --argjson frameCount "$produced" \
  --argjson width "$width" \
  --argjson height "$height" \
  --argjson sourceDuration "$duration" \
  '{
    assetName: $assetName,
    source: $source,
    directory: $directory,
    pattern: $pattern,
    format: $format,
    firstFrame: 1,
    frameCount: $frameCount,
    width: $width,
    height: $height,
    sourceDuration: $sourceDuration
  }' > "$work_manifest"

mv "$work_frames" "$frames_dir"
mv "$work_manifest" "$manifest"

printf '%s\n' "$frames_dir" "$manifest"
