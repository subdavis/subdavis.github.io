#!/usr/bin/env bash
# Convert all HEIC images in a folder to WebP using ImageMagick.
# Usage: heic2webp.sh <folder> [quality]
#   folder   - directory containing .HEIC files
#   quality  - WebP quality 1-100 (default: 85)

set -euo pipefail

FOLDER="${1:-}"
QUALITY="${2:-85}"

if [[ -z "$FOLDER" ]]; then
  echo "Usage: $(basename "$0") <folder> [quality]"
  exit 1
fi

if [[ ! -d "$FOLDER" ]]; then
  echo "Error: '$FOLDER' is not a directory."
  exit 1
fi

shopt -s nullglob nocaseglob
FILES=("$FOLDER"/*.heic)
shopt -u nullglob nocaseglob

if [[ ${#FILES[@]} -eq 0 ]]; then
  echo "No HEIC files found in '$FOLDER'."
  exit 0
fi

echo "Converting ${#FILES[@]} file(s) at quality $QUALITY..."

for f in "${FILES[@]}"; do
  out="${f%.*}.webp"
  echo "  $f -> $out"
  magick "$f" -quality "$QUALITY" "$out"
done

echo "Done."
