import os
import requests
from dotenv import load_dotenv

# Load env manually to be sure
load_dotenv()

API_KEY = "e5cd4e2275bea2f2a0842d1341af3fbfaeb31c5fbdf80841169ed2b62dca55c9" # Hardcoded to verify
VOICE_ID = "WJpjDSyvX9IlViFr1DGb"

def test_tts(text):
    print(f"Testing TTS for: {text}")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json"
    }
    data = {
        "text": text,
        "model_id": "eleven_turbo_v2_5",
        "output_format": "mp3_44100_128"
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        print("Success! Audio generated.")
        with open("test_audio.mp3", "wb") as f:
            f.write(response.content)
        print("Saved to test_audio.mp3")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_tts("Hello, this is a test of the Multivac voice system.")
