import os
try:
    from PIL import Image
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

start_dir = r"c:\Users\TearS\OneDrive\Desktop\Cyberdelic.Nexus\Courses\Cyberdelics 101\Cyberdelics-101-Web Structure"

print("Starting PNG to WEBP conversion process...")

# 1. Convert PNG to WEBP
converted_count = 0
for root, _, files in os.walk(start_dir):
    for filename in files:
        if filename.lower().endswith('.png'):
            png_path = os.path.join(root, filename)
            webp_path = os.path.splitext(png_path)[0] + ".webp"
            
            if not os.path.exists(webp_path):
                try:
                    img = Image.open(png_path)
                    img.save(webp_path, "WEBP", quality=85) # Good default compression
                    converted_count += 1
                    print(f"Converted: {filename} -> {os.path.basename(webp_path)}")
                except Exception as e:
                    print(f"Error converting {png_path}: {e}")

print(f"\nFinished converting {converted_count} PNG files to WEBP.")

# 2. Update File References
valid_extensions = {".json", ".js", ".tsx", ".html", ".css", ".md"}
updated_files = 0
for root, _, files in os.walk(start_dir):
    for filename in files:
        if filename == "convert_to_webp.py":
            continue # ignore self
            
        ext = os.path.splitext(filename)[1].lower()
        if ext in valid_extensions:
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Replace .png with .webp
                if ".png" in content or ".PNG" in content:
                    new_content = content.replace(".png", ".webp").replace(".PNG", ".webp")
                    
                    if content != new_content:
                        with open(filepath, 'w', encoding='utf-8', newline='') as f:
                            f.write(new_content)
                        updated_files += 1
            except Exception as e:
                pass


print(f"Updated PNG references in {updated_files} text files.")
