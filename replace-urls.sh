#!/bin/bash
# Replace all Squarespace CDN URLs in dungeon.html with local paths
MAP="/tmp/benja-local/url-mapping.txt"
FILE="/tmp/benja-local/dungeon.html"

# Make a backup first
cp "$FILE" "$FILE.bak"

count=0
while IFS='|' read -r old_url new_path; do
  if [ "$new_path" != "FAILED" ] && [ -n "$old_url" ] && [ -n "$new_path" ]; then
    # Escape special chars in URL for sed
    escaped_old=$(printf '%s\n' "$old_url" | sed 's/[&/\]/\\&/g')
    escaped_new=$(printf '%s\n' "$new_path" | sed 's/[&/\]/\\&/g')
    
    # Replace all occurrences
    sed -i '' "s|${old_url}|${new_path}|g" "$FILE"
    count=$((count + 1))
  fi
done < "$MAP"

echo "Replaced $count URL patterns"

# Verify no squarespace URLs remain
remaining=$(grep -c 'squarespace-cdn' "$FILE" || true)
echo "Remaining squarespace-cdn references: $remaining"
