import os

file_path = ".env"
if not os.path.exists(file_path):
    print("File not found!")
else:
    print(f"File size: {os.path.getsize(file_path)} bytes")
    try:
        with open(file_path, 'rb') as f:
            raw = f.read()
            print(f"Raw bytes: {raw}")
            try:
                print(f"Decoded (utf-8): {raw.decode('utf-8')}")
            except:
                print("Decode utf-8 failed")
            try:
                print(f"Decoded (utf-16): {raw.decode('utf-16')}")
            except:
                print("Decode utf-16 failed")
    except Exception as e:
        print(f"Error reading: {e}")
