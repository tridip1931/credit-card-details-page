#!/bin/bash
# download-assets.sh - Download all Figma assets from localhost

cd "$(dirname "$0")/assets"

echo "Downloading SVG assets from Figma..."

# SVG files
for hash in \
  02e9afdfbbf5a8fccbbea895768615d75fe735d9 \
  29a5415ca9c35cc325f0741706a4b2e6f7b4e50f \
  30ef96328bc951d6a8185390ccddd8a4efa44db8 \
  33abc970d8b5f56fa57303adbdbc3b0b4f545862 \
  34746245cb1c4ab36dbc112b2a28f2b0d43250c2 \
  3cc98ca22533ac49504cf7b64315ba453837069f \
  5bd02390f893d28e0c5e8fac8b7aca7d5ed87e7d \
  6668ee8024a404cf44c8ee97dd1ac234e89f6b5c \
  6f985f153d183048a94efc0ccb914d4f2112831c \
  73cd75d728128b946ed066a95e1b6b1a98f23f34 \
  94e93e8554df95c767deab21083505483efba3a7 \
  96c09e3efe018f378c0d28c7e89164d0db5df77e \
  9954aac6cb29a843c83f418efc0839fe0749b74b \
  9c48718c1df35dd36a63ff59ee9003960ce407cb \
  bf23867c128c78eed507f37d13a620defdfdb2f5 \
  e0608643285971d6e5c0423438c770d18c26d08f \
  e07dff6988b677ba7aae09d51eb17f809d15dcb4 \
  f3e90360c7a72eee8bd80c673d94795d50715bdc \
  f3ea6b4b5189dc1643e8a11ce0b4781078761170 \
  fcb9d070704e6f64b01d4f1c8db6e44f07ccaf0e \
  fe1dfdd76781dd9cd835467cf2ef2737a6b79b01
do
  echo "  Downloading $hash.svg..."
  curl -s -f -o "$hash.svg" "http://localhost:3845/assets/$hash.svg" || echo "    Failed to download $hash.svg"
done

echo ""
echo "Downloading PNG assets from Figma..."

# PNG files
for hash in \
  1ce5cae0439afb61ee550942de6700afa15d46cd \
  5ee3164f9604630890b1800650335f7773d097e4 \
  9fd854c883b2ba7d0aaec0cf6a33afe5423eca7c \
  a18562acf2be79c6fca55166a6e153f4fd8b6b80 \
  f2f07f93c25cb21635c35670814549728720629a \
  ffc9d631483b5a22d313f8297026315e5b9f54ef
do
  echo "  Downloading $hash.png..."
  curl -s -f -o "$hash.png" "http://localhost:3845/assets/$hash.png" || echo "    Failed to download $hash.png"
done

echo ""
echo "Download complete!"
echo ""
echo "Verifying downloaded files:"
ls -lh | grep -E '\.(svg|png)$' | wc -l | xargs echo "Total files:"

