#!/bin/bash
# Download all Squarespace CDN images for dungeon page
# Creates numbered files and a mapping for URL replacement

DEST="/tmp/benja-local/public/img/dungeon"
URLS="/tmp/benja-local/squarespace-urls.txt"
MAP="/tmp/benja-local/url-mapping.txt"

> "$MAP"
i=1

while IFS= read -r url; do
  # Extract file extension from URL
  basename=$(echo "$url" | sed 's|.*/||' | sed 's|%2B|+|g' | sed 's|%28|(|g' | sed 's|%29|)|g')
  ext="${basename##*.}"
  
  # Sanitize: just use numbered files to avoid path issues
  filename="dg-$(printf '%03d' $i).${ext}"
  
  echo "[$i/254] Downloading: $filename"
  
  # Download with curl, follow redirects, silent with progress
  if curl -sL -o "$DEST/$filename" "$url" --max-time 30; then
    # Record mapping: old URL -> new path
    echo "$url|/img/dungeon/$filename" >> "$MAP"
  else
    echo "  FAILED: $url"
    echo "$url|FAILED" >> "$MAP"
  fi
  
  i=$((i + 1))
done < "$URLS"

echo ""
echo "Done! Downloaded $((i - 1)) images."
echo "Mapping file: $MAP"
echo "Failed downloads:"
grep "FAILED" "$MAP" | wc -l
