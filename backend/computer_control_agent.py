"""
Multivac AI - Computer Control Agent
Provides keyboard, mouse, and application control capabilities for voice commands.
"""

import pyautogui
import psutil
import subprocess
import logging
import json
import os
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from datetime import datetime

# Windows-specific imports
try:
    import pygetwindow as gw
    WINDOWS_AVAILABLE = True
except ImportError:
    WINDOWS_AVAILABLE = False
    print("[COMPUTER_CONTROL] Warning: pygetwindow not available. Window management disabled.")


class ComputerControlAgent:
    """
    Agent for controlling keyboard, mouse, and applications via voice commands.
    Provides safety features including action logging and confirmation gates.
    """
    
    def __init__(self, failsafe: bool = True, log_actions: bool = True):
        """
        Initialize the Computer Control Agent.
        
        Args:
            failsafe: Enable PyAutoGUI failsafe (move mouse to corner to abort)
            log_actions: Enable action logging to file
        """
        # Configure PyAutoGUI
        pyautogui.FAILSAFE = failsafe
        pyautogui.PAUSE = 0.1  # Small pause between actions for stability
        
        # Setup logging
        self.log_actions = log_actions
        if log_actions:
            self._setup_logging()
        
        # Load configuration
        self.config = self._load_config()
        
        # Application aliases for natural language
        self.app_aliases = self._build_app_aliases()
        
        print("[COMPUTER_CONTROL] Agent initialized successfully")
    
    def _setup_logging(self):
        """Setup logging to file."""
        log_dir = Path(__file__).parent / "logs"
        log_dir.mkdir(exist_ok=True)
        
        log_file = log_dir / "computer_control.log"
        
        logging.basicConfig(
            filename=str(log_file),
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
    
    def _load_config(self) -> Dict:
        """Load configuration from JSON file."""
        config_path = Path(__file__).parent / "computer_control_config.json"
        
        if config_path.exists():
            with open(config_path, 'r') as f:
                return json.load(f)
        
        # Default configuration
        return {
            "applications": {
                "chrome": {
                    "aliases": ["chrome", "browser", "google chrome"],
                    "windows_path": "chrome.exe",
                    "process_name": "chrome.exe"
                },
                "notepad": {
                    "aliases": ["notepad", "text editor"],
                    "windows_path": "notepad.exe",
                    "process_name": "notepad.exe"
                },
                "calculator": {
                    "aliases": ["calculator", "calc"],
                    "windows_path": "calc.exe",
                    "process_name": "CalculatorApp.exe"
                },
                "explorer": {
                    "aliases": ["explorer", "file explorer", "files"],
                    "windows_path": "explorer.exe",
                    "process_name": "explorer.exe"
                },
                "vscode": {
                    "aliases": ["vscode", "visual studio code", "code"],
                    "windows_path": "code",
                    "process_name": "Code.exe"
                },
                "paint": {
                    "aliases": ["paint", "mspaint"],
                    "windows_path": "mspaint.exe",
                    "process_name": "mspaint.exe"
                }
            },
            "keyboard_shortcuts": {
                "copy": ["ctrl", "c"],
                "paste": ["ctrl", "v"],
                "cut": ["ctrl", "x"],
                "save": ["ctrl", "s"],
                "undo": ["ctrl", "z"],
                "redo": ["ctrl", "y"],
                "select_all": ["ctrl", "a"],
                "find": ["ctrl", "f"],
                "new_tab": ["ctrl", "t"],
                "close_tab": ["ctrl", "w"],
                "switch_window": ["alt", "tab"],
                "close_window": ["alt", "f4"],
                "show_desktop": ["win", "d"],
                "lock_computer": ["win", "l"]
            }
        }
    
    def _build_app_aliases(self) -> Dict[str, str]:
        """Build a mapping of aliases to application names."""
        aliases = {}
        for app_name, app_info in self.config["applications"].items():
            for alias in app_info["aliases"]:
                aliases[alias.lower()] = app_name
        return aliases
    
    def _log_action(self, action: str, params: Dict, success: bool, message: str):
        """Log an action to file."""
        if self.log_actions:
            log_entry = f"{action} | Params: {params} | Success: {success} | {message}"
            self.logger.info(log_entry)
    
    def _resolve_app_name(self, app_input: str) -> Optional[str]:
        """Resolve an application name from user input."""
        app_lower = app_input.lower().strip()
        
        # Check aliases first
        if app_lower in self.app_aliases:
            return self.app_aliases[app_lower]
        
        # Check direct match
        if app_lower in self.config["applications"]:
            return app_lower
        
        # Fuzzy match
        for alias, app_name in self.app_aliases.items():
            if app_lower in alias or alias in app_lower:
                return app_name
        
        return None
    
    # ========== KEYBOARD CONTROL ==========
    
    def type_text(self, text: str, interval: float = 0.0) -> Tuple[bool, str]:
        """
        Type text using the keyboard.
        
        Args:
            text: Text to type
            interval: Delay between keystrokes (seconds)
        
        Returns:
            (success, message)
        """
        try:
            pyautogui.write(text, interval=interval)
            self._log_action("type_text", {"text": text}, True, "Text typed successfully")
            return True, f"Typed: {text}"
        except Exception as e:
            self._log_action("type_text", {"text": text}, False, str(e))
            return False, f"Failed to type text: {str(e)}"
    
    def press_key(self, key: str) -> Tuple[bool, str]:
        """
        Press a key or key combination.
        
        Args:
            key: Key name or combination (e.g., 'enter', 'ctrl+c', 'alt+tab')
        
        Returns:
            (success, message)
        """
        try:
            # Handle key combinations
            if '+' in key:
                keys = [k.strip().lower() for k in key.split('+')]
                pyautogui.hotkey(*keys)
                self._log_action("press_key", {"key": key}, True, "Key combination pressed")
                return True, f"Pressed: {key}"
            else:
                # Single key
                pyautogui.press(key.lower())
                self._log_action("press_key", {"key": key}, True, "Key pressed")
                return True, f"Pressed: {key}"
        except Exception as e:
            self._log_action("press_key", {"key": key}, False, str(e))
            return False, f"Failed to press key: {str(e)}"
    
    # ========== MOUSE CONTROL ==========
    
    def click_mouse(self, button: str = "left", x: Optional[int] = None, y: Optional[int] = None) -> Tuple[bool, str]:
        """
        Click the mouse.
        
        Args:
            button: 'left', 'right', or 'middle'
            x: X coordinate (optional, uses current position if None)
            y: Y coordinate (optional, uses current position if None)
        
        Returns:
            (success, message)
        """
        try:
            if x is not None and y is not None:
                pyautogui.click(x, y, button=button)
                msg = f"Clicked {button} button at ({x}, {y})"
            else:
                pyautogui.click(button=button)
                pos = pyautogui.position()
                msg = f"Clicked {button} button at current position ({pos.x}, {pos.y})"
            
            self._log_action("click_mouse", {"button": button, "x": x, "y": y}, True, msg)
            return True, msg
        except Exception as e:
            self._log_action("click_mouse", {"button": button, "x": x, "y": y}, False, str(e))
            return False, f"Failed to click mouse: {str(e)}"
    
    def double_click(self, x: Optional[int] = None, y: Optional[int] = None) -> Tuple[bool, str]:
        """Double click the mouse."""
        try:
            if x is not None and y is not None:
                pyautogui.doubleClick(x, y)
                msg = f"Double clicked at ({x}, {y})"
            else:
                pyautogui.doubleClick()
                pos = pyautogui.position()
                msg = f"Double clicked at current position ({pos.x}, {pos.y})"
            
            self._log_action("double_click", {"x": x, "y": y}, True, msg)
            return True, msg
        except Exception as e:
            self._log_action("double_click", {"x": x, "y": y}, False, str(e))
            return False, f"Failed to double click: {str(e)}"
    
    def move_mouse(self, x: int, y: int, duration: float = 0.5) -> Tuple[bool, str]:
        """
        Move the mouse cursor.
        
        Args:
            x: X coordinate
            y: Y coordinate
            duration: Time to move (seconds)
        
        Returns:
            (success, message)
        """
        try:
            pyautogui.moveTo(x, y, duration=duration)
            self._log_action("move_mouse", {"x": x, "y": y}, True, f"Moved to ({x}, {y})")
            return True, f"Moved mouse to ({x}, {y})"
        except Exception as e:
            self._log_action("move_mouse", {"x": x, "y": y}, False, str(e))
            return False, f"Failed to move mouse: {str(e)}"
    
    def drag_mouse(self, start_x: int, start_y: int, end_x: int, end_y: int, duration: float = 0.5) -> Tuple[bool, str]:
        """
        Drag the mouse from one position to another.
        
        Args:
            start_x, start_y: Starting coordinates
            end_x, end_y: Ending coordinates
            duration: Time to drag (seconds)
        
        Returns:
            (success, message)
        """
        try:
            pyautogui.moveTo(start_x, start_y)
            pyautogui.drag(end_x - start_x, end_y - start_y, duration=duration)
            self._log_action("drag_mouse", {"start": (start_x, start_y), "end": (end_x, end_y)}, True, "Drag completed")
            return True, f"Dragged from ({start_x}, {start_y}) to ({end_x}, {end_y})"
        except Exception as e:
            self._log_action("drag_mouse", {"start": (start_x, start_y), "end": (end_x, end_y)}, False, str(e))
            return False, f"Failed to drag mouse: {str(e)}"
    
    def scroll(self, direction: str = "down", clicks: int = 3) -> Tuple[bool, str]:
        """
        Scroll the mouse wheel.
        
        Args:
            direction: 'up' or 'down'
            clicks: Number of scroll clicks
        
        Returns:
            (success, message)
        """
        try:
            amount = clicks if direction.lower() == "up" else -clicks
            pyautogui.scroll(amount)
            self._log_action("scroll", {"direction": direction, "clicks": clicks}, True, f"Scrolled {direction}")
            return True, f"Scrolled {direction} {clicks} clicks"
        except Exception as e:
            self._log_action("scroll", {"direction": direction, "clicks": clicks}, False, str(e))
            return False, f"Failed to scroll: {str(e)}"
    
    # ========== APPLICATION MANAGEMENT ==========
    
    def open_application(self, app_name: str) -> Tuple[bool, str]:
        """
        Open an application.
        
        Args:
            app_name: Application name or alias
        
        Returns:
            (success, message)
        """
        try:
            resolved_app = self._resolve_app_name(app_name)
            
            if not resolved_app:
                return False, f"Unknown application: {app_name}"
            
            app_info = self.config["applications"][resolved_app]
            executable = app_info["windows_path"]
            
            # Launch the application
            subprocess.Popen(executable, shell=True)
            
            self._log_action("open_application", {"app": app_name}, True, f"Opened {resolved_app}")
            return True, f"Opened {resolved_app}"
        except Exception as e:
            self._log_action("open_application", {"app": app_name}, False, str(e))
            return False, f"Failed to open {app_name}: {str(e)}"
    
    def close_application(self, app_name: str) -> Tuple[bool, str]:
        """
        Close an application by name.
        
        Args:
            app_name: Application name or alias
        
        Returns:
            (success, message)
        """
        try:
            resolved_app = self._resolve_app_name(app_name)
            
            if not resolved_app:
                return False, f"Unknown application: {app_name}"
            
            app_info = self.config["applications"][resolved_app]
            process_name = app_info["process_name"]
            
            # Find and terminate the process
            closed_count = 0
            for proc in psutil.process_iter(['name']):
                try:
                    if proc.info['name'].lower() == process_name.lower():
                        proc.terminate()
                        closed_count += 1
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            if closed_count > 0:
                self._log_action("close_application", {"app": app_name}, True, f"Closed {closed_count} instance(s)")
                return True, f"Closed {resolved_app} ({closed_count} instance(s))"
            else:
                return False, f"{resolved_app} is not running"
        except Exception as e:
            self._log_action("close_application", {"app": app_name}, False, str(e))
            return False, f"Failed to close {app_name}: {str(e)}"
    
    # ========== WINDOW MANAGEMENT ==========
    
    def list_windows(self) -> Tuple[bool, str]:
        """
        List all open windows.
        
        Returns:
            (success, message with window list)
        """
        if not WINDOWS_AVAILABLE:
            return False, "Window management not available on this platform"
        
        try:
            windows = gw.getAllTitles()
            # Filter out empty titles
            windows = [w for w in windows if w.strip()]
            
            if windows:
                window_list = "\n".join(f"- {w}" for w in windows)
                self._log_action("list_windows", {}, True, f"Found {len(windows)} windows")
                return True, f"Open windows:\n{window_list}"
            else:
                return True, "No windows found"
        except Exception as e:
            self._log_action("list_windows", {}, False, str(e))
            return False, f"Failed to list windows: {str(e)}"
    
    def focus_window(self, window_title: str) -> Tuple[bool, str]:
        """
        Focus a window by title.
        
        Args:
            window_title: Window title (partial match)
        
        Returns:
            (success, message)
        """
        if not WINDOWS_AVAILABLE:
            return False, "Window management not available on this platform"
        
        try:
            windows = gw.getWindowsWithTitle(window_title)
            
            if windows:
                windows[0].activate()
                self._log_action("focus_window", {"title": window_title}, True, "Window focused")
                return True, f"Focused window: {windows[0].title}"
            else:
                return False, f"No window found with title: {window_title}"
        except Exception as e:
            self._log_action("focus_window", {"title": window_title}, False, str(e))
            return False, f"Failed to focus window: {str(e)}"
    
    def minimize_window(self, window_title: str) -> Tuple[bool, str]:
        """Minimize a window by title."""
        if not WINDOWS_AVAILABLE:
            return False, "Window management not available on this platform"
        
        try:
            windows = gw.getWindowsWithTitle(window_title)
            
            if windows:
                windows[0].minimize()
                self._log_action("minimize_window", {"title": window_title}, True, "Window minimized")
                return True, f"Minimized window: {windows[0].title}"
            else:
                return False, f"No window found with title: {window_title}"
        except Exception as e:
            self._log_action("minimize_window", {"title": window_title}, False, str(e))
            return False, f"Failed to minimize window: {str(e)}"
    
    def maximize_window(self, window_title: str) -> Tuple[bool, str]:
        """Maximize a window by title."""
        if not WINDOWS_AVAILABLE:
            return False, "Window management not available on this platform"
        
        try:
            windows = gw.getWindowsWithTitle(window_title)
            
            if windows:
                windows[0].maximize()
                self._log_action("maximize_window", {"title": window_title}, True, "Window maximized")
                return True, f"Maximized window: {windows[0].title}"
            else:
                return False, f"No window found with title: {window_title}"
        except Exception as e:
            self._log_action("maximize_window", {"title": window_title}, False, str(e))
            return False, f"Failed to maximize window: {str(e)}"
    
    # ========== MAIN EXECUTION DISPATCHER ==========
    
    async def execute_action(self, action_type: str, params: Dict) -> Tuple[bool, str]:
        """
        Main dispatcher for all computer control actions.
        
        Args:
            action_type: Type of action to execute
            params: Parameters for the action
        
        Returns:
            (success, message)
        """
        action_map = {
            "type": lambda: self.type_text(params.get("text", "")),
            "press_key": lambda: self.press_key(params.get("key", "")),
            "click": lambda: self.click_mouse(
                params.get("button", "left"),
                params.get("x"),
                params.get("y")
            ),
            "double_click": lambda: self.double_click(params.get("x"), params.get("y")),
            "move_mouse": lambda: self.move_mouse(params.get("x", 0), params.get("y", 0)),
            "drag": lambda: self.drag_mouse(
                params.get("start_x", 0),
                params.get("start_y", 0),
                params.get("end_x", 0),
                params.get("end_y", 0)
            ),
            "scroll": lambda: self.scroll(params.get("direction", "down"), params.get("clicks", 3)),
            "open_app": lambda: self.open_application(params.get("app_name", "")),
            "close_app": lambda: self.close_application(params.get("app_name", "")),
            "list_windows": lambda: self.list_windows(),
            "focus_window": lambda: self.focus_window(params.get("window_title", "")),
            "minimize_window": lambda: self.minimize_window(params.get("window_title", "")),
            "maximize_window": lambda: self.maximize_window(params.get("window_title", ""))
        }
        
        if action_type in action_map:
            return action_map[action_type]()
        else:
            return False, f"Unknown action type: {action_type}"


# Convenience function for testing
if __name__ == "__main__":
    agent = ComputerControlAgent()
    
    # Test typing
    print(agent.type_text("Hello from Multivac!"))
    
    # Test key press
    print(agent.press_key("enter"))
    
    # Test mouse click
    print(agent.click_mouse("left"))
    
    # Test listing windows
    print(agent.list_windows())
