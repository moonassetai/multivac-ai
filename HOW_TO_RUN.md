# How to Run Multivac AI

## Setup (One-Time)
If this is your first time running the system, or if you encounter "Not Found" errors:
```cmd
npm install
npm run build
```
*This prepares the web interface.*

## Prerequisites (CRITICAL)

- **Python 3.10 OR 3.11** (Required!)
  - ❌ **DO NOT use Python 3.14 or 3.13** (They are too new and will fail).
  - ✅ Download Python 3.11 here: [Python 3.11.9 Download](https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe)
  - **IMPORTANT:** Check the box **"Add Python to PATH"** in the installer.
  - After installing, run `py --list` to confirm you have 3.11 available.

## Quick Start

1.  **Open Terminal**
    Navigate to the project directory:
    ```cmd
    cd c:\Users\USER\Documents\APPS\Multivac-AI
    ```

2.  **Launch System**
    Run the startup script:
    ```cmd
    .\start_multivac.bat
    ```
    *This will automatically activate the virtual environment and start the server.*

3.  **Verify Status**
    Wait for the message:
    `INFO: Uvicorn running on http://127.0.0.1:8000`

## Understanding the Commands (ELI5)

If you're new to this, here is what those "npm" commands actually do:

### `npm install` 🛒
Think of this like **grocery shopping**. 
-   The code has a "shopping list" (package.json) of all the tools it needs to work.
-   This command goes out to the internet, downloads all those tools, and puts them in a folder called `node_modules`.

### `npm run build` 🏗️
Think of this like **assembling a Lego set**.
-   The code you downloaded is like a box of loose Lego bricks. The browser can't understand them yet.
-   This command takes all those loose bricks and builds them into the final spaceship (the website) that you can actually see and use. It puts this finished product in a folder called `dist`.

## Interaction Modes

### 🎤 Voice Control
Once running, Multivac usually defaults to listening for voice input (if a microphone is detected). Speak clearly to interact.

#### Computer Control Commands
Multivac can now control your computer through voice commands:

**Application Management:**
- "Open Chrome" - Launches Google Chrome
- "Open Notepad" - Launches Notepad
- "Close [app name]" - Closes the specified application
- "Show all windows" - Lists all open windows

**Keyboard Control:**
- "Type [your text]" - Types text in the active window
- "Press Enter" - Presses the Enter key
- "Press Ctrl+C" - Executes keyboard shortcuts
- "Press Tab" - Presses special keys

**Mouse Control:**
- "Click" - Clicks at current mouse position
- "Move mouse to [x], [y]" - Moves mouse to coordinates
- "Scroll down" / "Scroll up" - Scrolls the mouse wheel

**Window Management:**
- "Minimize window" - Minimizes the active window
- "Focus Chrome" - Brings Chrome to the foreground

> **Safety Note:** Multivac will ask for confirmation before closing applications or performing potentially destructive actions.

### 🌐 Web Interface
Open your browser and navigate to:
[http://localhost:8000](http://localhost:8000)

*(Note: If you have a separate frontend `index.html`, open that file in your browser.)*

## Stopping the System
To shut down Multivac:
1.  Click inside the terminal window.
2.  Press `Ctrl + C`.
3.  Type `Y` and press Enter if prompted to terminate the batch job.

## Troubleshooting

-   **Microphone Issues**: Ensure your default recording device is set correctly in Windows Sound Settings.
-   **API Errors**: Check your `.env` file to ensure `GEMINI_API_KEY` is valid.
-   **Port In Use**: If port 8000 is taken, the server will fail to start. Close other applications using this port.
-   **Blank Page**: If the page loads but is blank, ensure you have run `npm install` and `npm run build`. 
    -   *Note: I have patched the `src/App.jsx` to work in a regular browser by bypassing the Electron requirement.*
-   **Computer Control Not Working**: Ensure PyAutoGUI and dependencies are installed: `pip install pyautogui pygetwindow psutil`
