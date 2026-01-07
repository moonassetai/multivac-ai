# Multivac AI - Computer Control Guide

## Overview

Multivac AI now features comprehensive computer control capabilities, allowing you to control your Windows PC entirely through voice commands. This guide covers all available commands and best practices.

---

## 🎮 Application Management

### Launching Applications

**Voice Commands:**
- "Open Chrome" / "Launch Chrome" / "Start Chrome browser"
- "Open Notepad"
- "Open Calculator"
- "Open File Explorer"
- "Open Visual Studio Code"
- "Launch Task Manager"

**Supported Applications:**
| Voice Command | Application |
|--------------|-------------|
| Chrome / Browser | Google Chrome |
| Notepad | Windows Notepad |
| Calculator / Calc | Windows Calculator |
| File Explorer / Explorer | Windows File Explorer |
| VSCode / Visual Studio Code | Visual Studio Code |
| Task Manager | Windows Task Manager |
| Paint | Microsoft Paint |
| Word | Microsoft Word |
| Excel | Microsoft Excel |

### Closing Applications

**Voice Commands:**
- "Close Chrome"
- "Close Notepad"
- "Close [application name]"

> **⚠️ Safety:** Multivac will ask for confirmation before closing applications to prevent accidental data loss.

### Window Management

**Voice Commands:**
- "Show all windows" / "List open windows" - Displays all currently open windows
- "Focus Chrome" / "Switch to Chrome" - Brings Chrome to the foreground
- "Minimize window" / "Minimize this" - Minimizes the active window
- "Maximize window" - Maximizes the active window
- "Restore window" - Restores a minimized/maximized window

---

## ⌨️ Keyboard Control

### Typing Text

**Voice Commands:**
- "Type hello world" - Types "hello world" in the active window
- "Type [any text]" - Types the specified text
- "Enter [text]" - Alternative phrasing

**Examples:**
```
You: "Type Dear Sir or Madam,"
Multivac: [Types the text in active window]

You: "Type my email is user@example.com"
Multivac: [Types the email address]
```

### Pressing Keys

**Voice Commands:**
- "Press Enter" / "Hit Enter"
- "Press Tab"
- "Press Escape" / "Press Esc"
- "Press Backspace"
- "Press Delete"
- "Press Space" / "Press Spacebar"
- "Press Arrow Up/Down/Left/Right"
- "Press F1" through "Press F12"
- "Press Page Up" / "Press Page Down"
- "Press Home" / "Press End"

### Keyboard Shortcuts

**Voice Commands:**
- "Press Ctrl+C" / "Copy this" - Copy
- "Press Ctrl+V" / "Paste" - Paste
- "Press Ctrl+X" / "Cut" - Cut
- "Press Ctrl+Z" / "Undo" - Undo
- "Press Ctrl+Y" / "Redo" - Redo
- "Press Ctrl+A" / "Select all" - Select All
- "Press Ctrl+S" / "Save" - Save
- "Press Ctrl+F" / "Find" - Find
- "Press Alt+Tab" / "Switch window" - Switch Windows
- "Press Alt+F4" / "Close window" - Close Window
- "Press Win+D" / "Show desktop" - Show Desktop
- "Press Win+E" / "Open explorer" - Open File Explorer
- "Press Win+R" / "Open run" - Open Run Dialog
- "Press Win+L" / "Lock computer" - Lock PC

**Custom Combinations:**
- "Press Ctrl+Shift+T" - Reopen closed tab (browser)
- "Press Ctrl+Shift+N" - New incognito window (browser)
- "Press Ctrl+Alt+Delete" - Security options

---

## 🖱️ Mouse Control

### Clicking

**Voice Commands:**
- "Click" - Left click at current position
- "Click here" - Left click at current position
- "Right click" - Right click at current position
- "Double click" - Double left click
- "Middle click" - Middle mouse button click

### Moving the Mouse

**Voice Commands:**
- "Move mouse to 500, 300" - Moves to coordinates (500, 300)
- "Move mouse to [x], [y]" - Moves to specified coordinates

> **💡 Tip:** You can find coordinates by looking at your screen resolution. For a 1920x1080 screen, center is approximately 960, 540.

### Dragging

**Voice Commands:**
- "Drag from 100, 100 to 500, 500" - Drag operation
- "Drag to [x], [y]" - Drag from current position

### Scrolling

**Voice Commands:**
- "Scroll down" - Scrolls down
- "Scroll up" - Scrolls up
- "Scroll down 5 clicks" - Scrolls down 5 notches
- "Scroll up 3 clicks" - Scrolls up 3 notches

---

## 🔒 Safety Features

### Confirmation Gates

Multivac requires confirmation before executing potentially destructive actions:

**Actions Requiring Confirmation:**
- ✅ Closing applications
- ✅ Killing processes
- ✅ Executing system commands
- ✅ File deletion (when implemented)

**Example:**
```
You: "Close Chrome"
Multivac: "Are you sure you want to close Chrome? This may result in data loss if you have unsaved work."
You: "Yes" / "Confirm"
Multivac: [Closes Chrome]
```

### Failsafe Mechanism

**Emergency Stop:**
- Move your mouse cursor to the **top-left corner** of the screen to immediately abort any ongoing automation
- This is a PyAutoGUI safety feature to prevent runaway automation

### Action Logging

All computer control actions are logged with timestamps for security and debugging:
- Location: `backend/logs/computer_control.log`
- Includes: Timestamp, action type, parameters, success/failure

---

## 💡 Usage Tips

### Natural Language Variations

Multivac understands multiple phrasings for the same action:

| Intent | Variations |
|--------|-----------|
| Open Chrome | "Open Chrome", "Launch Chrome", "Start Chrome browser", "Open Google Chrome" |
| Type text | "Type hello", "Write hello", "Enter hello" |
| Press Enter | "Press Enter", "Hit Enter", "Push Enter key" |
| Click | "Click", "Click here", "Click mouse" |

### Combining Commands

You can chain commands in natural conversation:

```
You: "Open Notepad, then type Hello World, then press Enter"
Multivac: [Executes each command in sequence]
```

### Context Awareness

Multivac is aware of:
- **Active Window:** Knows which application is currently focused
- **Mouse Position:** Can click at current position or move to coordinates
- **Screen Resolution:** Adapts to your display size

---

## 🛠️ Troubleshooting

### Computer Control Not Working

**Problem:** Voice commands are recognized but nothing happens

**Solutions:**
1. Ensure dependencies are installed:
   ```cmd
   pip install pyautogui pygetwindow psutil
   ```

2. Check if computer control is enabled in `backend/settings.json`:
   ```json
   {
     "computer_control": {
       "enabled": true
     }
   }
   ```

3. Verify Python has necessary permissions (run as administrator if needed)

### Application Not Found

**Problem:** "Open [app]" doesn't work

**Solutions:**
1. Use the exact application name (e.g., "Chrome" not "Google")
2. Check if the application is installed
3. Try alternative names (e.g., "Calculator" or "Calc")

### Keyboard/Mouse Actions Too Fast

**Problem:** Actions execute too quickly

**Solution:**
- Adjust timing in `backend/computer_control_agent.py`:
  ```python
  type_text(text, interval=0.1)  # Slower typing
  move_mouse(x, y, duration=1.0)  # Slower movement
  ```

### Failsafe Triggered Accidentally

**Problem:** Mouse corner triggers failsafe

**Solution:**
- Disable failsafe in `backend/settings.json`:
  ```json
  {
    "computer_control": {
      "failsafe_enabled": false
    }
  }
  ```
  
  > **⚠️ Warning:** Only disable if you're confident in your usage

---

## 🔐 Security Considerations

### Permissions

Computer control requires appropriate system permissions:
- **User-level:** Can control applications running under your user account
- **System-level:** Cannot control system processes or services (by design)

### Best Practices

1. **Review before confirming:** Always review confirmation prompts
2. **Keep logs:** Maintain action logs for security auditing
3. **Limit scope:** Only enable computer control when needed
4. **Use failsafe:** Keep the corner failsafe enabled for safety

---

## 📚 Advanced Usage

### Custom Application Aliases

You can add custom application aliases in `backend/computer_control_agent.py`:

```python
APP_ALIASES = {
    "browser": "chrome.exe",
    "editor": "code.exe",
    "terminal": "cmd.exe",
    # Add your custom aliases here
}
```

### Scripting Sequences

Create complex automation sequences:

```
You: "Open Notepad, type 'Meeting Notes', press Enter twice, type 'Date: January 7, 2026'"
Multivac: [Executes the full sequence]
```

### Screen Coordinates Reference

For a **1920x1080** display:
- Top-left: `(0, 0)`
- Top-right: `(1920, 0)`
- Bottom-left: `(0, 1080)`
- Bottom-right: `(1920, 1080)`
- Center: `(960, 540)`

---

## 🎯 Quick Reference

### Most Common Commands

| Command | Action |
|---------|--------|
| "Open Chrome" | Launch Chrome browser |
| "Type [text]" | Type text in active window |
| "Press Enter" | Press Enter key |
| "Click" | Click at current position |
| "Press Ctrl+C" | Copy selected text |
| "Press Ctrl+V" | Paste from clipboard |
| "Close [app]" | Close application |
| "Scroll down" | Scroll down |
| "Show all windows" | List open windows |

---

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `backend/logs/computer_control.log`
2. Review this guide for command syntax
3. Ensure all dependencies are installed
4. Verify settings in `backend/settings.json`
5. Test with simple commands first (e.g., "Click")

For more help, refer to the main [README.md](README.md) or [HOW_TO_RUN.md](HOW_TO_RUN.md).

---

**Multivac AI - Computer Control**  
*Your voice is now your keyboard and mouse.*
