                                README
                                
<img width="1280" height="720" alt="newest speech to speech thumbnail update " src="https://github.com/user-attachments/assets/860bf18d-09b2-4e5e-86cc-9b2e82a51d9d" />


🎥 New Feature: Camera-Enabled + Vision Version

Use pipeline_Coqui_Camera.py if you want to control your USB camera by voice
and let your LM Studio vision model (Qwen2-VL 7B) see and describe what’s in front of it.

🧠 New Capabilities

This version connects your voice commands directly to your camera and vision model,
adding full image and scene understanding.

You can now control your camera and analyze what it sees — live — with commands like:

🎬 Camera Control

turn camera on

turn camera off

take picture / snap photo

take screenshot / capture screen

record a short video

🧠 Vision and Object Understanding

describe image

analyze image

look at this image

what's in the picture

💻 Screen Description

describe screenshot

what you see on the screen

what's on the screen

describe screen shot

analyze screenshot

analyze screen shot

🚗 Object, Person, and Face Detection

The camera version now includes built-in smart detection functions:

find car in image → Detects cars in the current frame

find person in image → Checks if people are visible

detect faces → Identifies faces in the frame

detect body → Recognizes human bodies or outlines

Each detection runs through your Qwen2-VL model using the shared
describe_image_with_qwen() function — so all visual analysis uses the same high-accuracy vision engine.




[![Watch the video](https://img.youtube.com/vi/r3UFkIF_Hmw/0.jpg)](https://youtu.be/XXatAv0GTZo_Hmw)




⚙️ Setup (Camera Version)
1️⃣ Install Dependencies

Make sure you have your Conda environment active:

conda activate coqui
pip install opencv-python --no-deps

▶️ Start Up

Plug in your USB or laptop camera.

Run the script manually (no .bat file):

# Navigate to your folder
cd path/to/CoquiPipeline

# Activate your environment
conda activate coqui

# Run the camera version
python pipeline_Coqui_Camera.py


Speak one of the voice commands above.

Watch the screen for camera and vision feedback.

✅ Quick Launch (Optional)

If you want to start it by double-clicking, create a .bat file:

Open Notepad

Paste the following:

@echo off
echo ========================================
echo 🎥 Starting Voice + Camera Pipeline
echo ========================================
call conda activate coqui
cd /d C:\Users\<YOUR_USERNAME>\CoquiPipeline
python pipeline_Coqui_Camera.py
pause


Save it as:
start_camera_sts.bat

Double-click to start your voice + vision pipeline automatically 🎯

🧩 Requirements

Install the following packages if missing:

pip install opencv-python
pip install sounddevice
pip install soundfile
pip install termcolor
pip install pyfiglet
pip install requests
pip install keyboard
pip install pyautogui
pip install numpy
pip install torch
pip install openai-whisper
pip install TTS


✅ Coqui TTS + OpenCV + Qwen2-VL are all supported inside your coqui environment.

💡 Tips

1️⃣ If your camera doesn’t open, change this line in the script:

cap = cv2.VideoCapture(0)


Try 1 or 2 instead of 0.

2️⃣ The old version (pipeline_Coqui.py) still works perfectly without a camera if you want a lightweight mode.

🔗 Related Project

👉 LM-Studio-Speech-to-Speech

📢 Credits

Python

Git

Conda

OpenAI Whisper

Coqui TTS

LM Studio

Thanks for making this possible 🙏😁




