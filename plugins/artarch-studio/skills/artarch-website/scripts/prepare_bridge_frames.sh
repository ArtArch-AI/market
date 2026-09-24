#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <previous-video> <next-video> <output-dir> <bridge-name>\n' "$0" >&2
  exit 2
}

[[ $# -eq 4 ]] || usage

previous_video=$1
next_video=$2
output_dir=$3
bridge_name=$4

for input in "$previous_video" "$next_video"; do
  [[ -f "$input" ]] || {
    printf 'Input video does not exist: %s\n' "$input" >&2
    exit 1
  }
done

case "$bridge_name" in
  *[!a-zA-Z0-9_-]*|'')
    printf 'bridge-name may contain only letters, digits, underscore, and hyphen\n' >&2
    exit 1
    ;;
esac

for command_name in ffmpeg ffprobe jq; do
  command -v "$command_name" >/dev/null 2>&1 || {
    printf '%s is required\n' "$command_name" >&2
    exit 1
  }
done

previous_final="$output_dir/$bridge_name-a-final.jpg"
next_first="$output_dir/$bridge_name-b-first.jpg"
preview="$output_dir/$bridge_name-preview.jpg"
metadata="$output_dir/$bridge_name-metadata.json"

for output in "$previous_final" "$next_first" "$preview" "$metadata"; do
  [[ ! -e "$output" ]] || {
    printf 'Output already exists: %s\n' "$output" >&2
    exit 1
  }
done

mkdir -p "$output_dir"
work_dir=$(mktemp -d "$output_dir/.${bridge_name}.bridge.XXXXXX")

cleanup() {
  rm -rf -- "$work_dir"
}
trap cleanup EXIT

ffmpeg -hide_banner -loglevel error -y -sseof -1 -i "$previous_video" \
  -map 0:v:0 -an -vsync 0 -q:v 3 "$work_dir/a-%06d.jpg"

last_candidate=$(find "$work_dir" -maxdepth 1 -type f -name 'a-*.jpg' | sort | tail -n 1)
[[ -n "$last_candidate" ]] || {
  printf 'Could not extract the previous video final frame\n' >&2
  exit 1
}

ffmpeg -hide_banner -loglevel error -y -i "$last_candidate" \
  -frames:v 1 -vf "scale='min(1920,iw)':-2:flags=lanczos" -q:v 3 \
  "$work_dir/a-final.jpg"

ffmpeg -hide_banner -loglevel error -y -i "$next_video" \
  -map 0:v:0 -an -frames:v 1 \
  -vf "scale='min(1920,iw)':-2:flags=lanczos" -q:v 3 \
  "$work_dir/b-first.jpg"

ffmpeg -hide_banner -loglevel error -y \
  -i "$work_dir/a-final.jpg" -i "$work_dir/b-first.jpg" \
  -filter_complex \
  "[0:v]scale=640:640:force_original_aspect_ratio=decrease,pad=640:640:(ow-iw)/2:(oh-ih)/2:color=black[a];[1:v]scale=640:640:force_original_aspect_ratio=decrease,pad=640:640:(ow-iw)/2:(oh-ih)/2:color=black[b];[a][b]hstack=inputs=2" \
  -frames:v 1 -q:v 7 "$work_dir/preview.jpg"

previous_duration=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$previous_video")
next_duration=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$next_video")

jq -n \
  --arg bridgeName "$bridge_name" \
  --arg previousVideo "$(basename "$previous_video")" \
  --arg nextVideo "$(basename "$next_video")" \
  --arg previousFinal "$(basename "$previous_final")" \
  --arg nextFirst "$(basename "$next_first")" \
  --arg preview "$(basename "$preview")" \
  --argjson previousDuration "$previous_duration" \
  --argjson nextDuration "$next_duration" \
  '{
    bridgeName: $bridgeName,
    previousVideo: $previousVideo,
    nextVideo: $nextVideo,
    previousFinalFrame: $previousFinal,
    nextFirstFrame: $nextFirst,
    compressedPreview: $preview,
    previousDuration: $previousDuration,
    nextDuration: $nextDuration
  }' > "$work_dir/metadata.json"

mv "$work_dir/a-final.jpg" "$previous_final"
mv "$work_dir/b-first.jpg" "$next_first"
mv "$work_dir/preview.jpg" "$preview"
mv "$work_dir/metadata.json" "$metadata"

printf '%s\n' "$previous_final" "$next_first" "$preview" "$metadata"
