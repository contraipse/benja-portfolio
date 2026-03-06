#!/bin/bash
DEST="/tmp/benja-local/public/img/dungeon"
URLS="/tmp/benja-local/squarespace-urls.txt"
MAP="/tmp/benja-local/url-mapping.txt"

# Build list of what's already downloaded by checking the mapping file
downloaded=0
remaining=0
i=1

while IFS= read -r url; do
  basename=$(echo "$url" | sed 's|.*/||' | sed 's|%2B|+|g' | sed 's|%28|(|g' | sed 's|%29|)|g')
  ext="${basename##*.}"
  filename="dg-$(printf '%03d' $i).${ext}"
  
  if [ -f "$DEST/$filename" ] && [ -s "$DEST/$filename" ]; then
    # Already downloaded, just make sure mapping exists
    grep -q "^${url}|" "$MAP" 2>/dev/null || echo "$url|/img/dungeon/$filename" >> "$MAP"
    downloaded=$((downloaded + 1))
  else
    # Need to download - do it in background (up to 10 parallel)
    (
      curl -sL -o "$DEST/$filename" "$url" --max-time 30 && \
        echo "$url|/img/dungeon/$filename" >> "$MAP"
    ) &
    remaining=$((remaining + 1))
    
    # Limit to 10 parallel downloads
    if [ $((remaining % 10)) -eq 0 ]; then
      wait
      echo "Progress: $((downloaded + remaining)) / 254"
    fi
  fi
  
  i=$((i + 1))
done < "$URLS"

wait
echo "Done! Already had: $downloaded, newly downloaded: $remaining"
echo "Total files:"
ls "$DEST" | wc -l
