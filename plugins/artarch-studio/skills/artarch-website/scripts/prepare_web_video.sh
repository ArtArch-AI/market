#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <input-video> <output-dir> [asset-name]\n' "$0" >&2
  exit 2
}

[[ $# -ge 2 && $# -le 3 ]] || usage

input=$1
output_dir=$2
asset_name=${3:-hero}

[[ -f "$input" ]] || {
  printf 'Input video does not exist: %s\n' "$input" >&2
  exit 1
}

command -v ffmpeg >/dev/null 2>&1 || {
  printf 'ffmpeg is required\n' >&2
  exit 1
}
command -v ffprobe >/dev/null 2>&1 || {
  printf 'ffprobe is required\n' >&2
  exit 1
}

case "$asset_name" in
  *[!a-zA-Z0-9_-]*|'')
    printf 'asset-name may contain only letters, digits, underscore, and hyphen\n' >&2
    exit 1
    ;;
esac

mkdir -p "$output_dir"

mp4="$output_dir/$asset_name.mp4"
webm="$output_dir/$asset_name.webm"
poster="$output_dir/$asset_name-poster.jpg"
contact="$output_dir/$asset_name-contact.jpg"
metadata="$output_dir/$asset_name-metadata.json"

duration=$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$input")

interval=$(awk -v duration="$duration" 'BEGIN {
  value = duration / 4.0;
  if (value < 0.25) value = 0.25;
  printf "%.4f", value;
}')

ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -map 0:v:0 -an \
  -vf "scale='min(1920,iw)':-2:flags=lanczos" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p \
  -movflags +faststart "$mp4"

ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -map 0:v:0 -an \
  -vf "scale='min(1600,iw)':-2:flags=lanczos" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 "$webm"

ffmpeg -hide_banner -loglevel error -y -ss 0.2 -i "$input" \
  -frames:v 1 -vf "scale='min(1600,iw)':-2:flags=lanczos" \
  -q:v 3 "$poster"

ffmpeg -hide_banner -loglevel error -y -i "$input" \
  -vf "fps=1/$interval,scale=320:-2:flags=lanczos,tile=4x1:padding=4:margin=4" \
  -frames:v 1 -q:v 7 "$contact"

ffprobe -v error -show_entries \
  format=duration,size,bit_rate:stream=index,codec_name,codec_type,width,height,r_frame_rate \
  -of json "$mp4" > "$metadata"

printf '%s\n' "$mp4" "$webm" "$poster" "$contact" "$metadata"
