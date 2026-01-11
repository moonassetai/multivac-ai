import os
from google import genai
try:
    client = genai.Client(api_key="dummy")
    print("Client init success")
except Exception as e:
    print(f"Client init failed: {e}")
