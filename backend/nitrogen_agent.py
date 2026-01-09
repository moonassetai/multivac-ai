"""
Multivac AI - NitroGen Agent
Provides AI-powered gaming capabilities using NVIDIA's NitroGen foundation model.
"""

import asyncio
import subprocess
import os
import time
import numpy as np
from pathlib import Path
from typing import Optional, Tuple, Dict
import psutil

# NitroGen imports
try:
    from nitrogen.inference_client import ModelClient
    from nitrogen.game_env import get_process_info, GamepadEmulator, DxcamScreenshotBackend, PyautoguiScreenshotBackend
    import pywinctl as pwc
    NITROGEN_AVAILABLE = True
except ImportError:
    NITROGEN_AVAILABLE = False
    print("[NITROGEN] Warning: NitroGen not available. Install with: pip install -e ./NitroGen")


class NitrogenAgent:
    """
    Agent for AI-powered gaming using NitroGen vision-to-action model.
    Integrates with Multivac's voice control system.
    """
    
    def __init__(self, model_path: Optional[str] = None, server_port: int = 5555):
        """
        Initialize the NitroGen Agent.
        
        Args:
            model_path: Path to ng.pt model file (auto-detected if None)
            server_port: Port for NitroGen inference server
        """
        if not NITROGEN_AVAILABLE:
            raise ImportError("NitroGen not installed. Run: pip install -e ./NitroGen")
        
        # Auto-detect model path if not provided
        if model_path is None:
            model_path = self._find_model_path()
        
        self.model_path = model_path
        self.server_port = server_port
        self.server_process = None
        self.client = None
        self.is_playing = False
        self.game_process_name = None
        self.gamepad_emulator = None
        self.screenshot_backend = None
        self.game_window = None
        
        print(f"[NITROGEN] Agent initialized with model: {model_path}")
    
    def _find_model_path(self) -> str:
        """Auto-detect NitroGen model path from Hugging Face cache."""
        cache_dir = Path.home() / ".cache" / "huggingface" / "hub"
        model_dir = cache_dir / "models--nvidia--NitroGen"
        
        if model_dir.exists():
            # Find the snapshot directory
            snapshots = list((model_dir / "snapshots").glob("*"))
            if snapshots:
                model_file = snapshots[0] / "ng.pt"
                if model_file.exists():
                    return str(model_file)
        
        raise FileNotFoundError(
            "NitroGen model not found. Download with: huggingface-cli download nvidia/NitroGen ng.pt"
        )
    
    async def start_server(self) -> Tuple[bool, str]:
        """
        Start the NitroGen inference server.
        
        Returns:
            (success, message)
        """
        if self.server_process is not None:
            return True, "Server already running"
        
        try:
            # Get the NitroGen directory
            nitrogen_dir = Path(__file__).parent.parent / "NitroGen"
            serve_script = nitrogen_dir / "scripts" / "serve.py"
            
            if not serve_script.exists():
                return False, f"NitroGen serve script not found at {serve_script}"
            
            # Start server process
            print(f"[NITROGEN] Starting inference server on port {self.server_port}...")
            self.server_process = subprocess.Popen(
                [
                    "python",
                    str(serve_script),
                    self.model_path,
                    "--port", str(self.server_port)
                ],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            # Wait for server to be ready (check for port binding)
            max_wait = 60  # seconds
            start_time = time.time()
            
            while time.time() - start_time < max_wait:
                try:
                    # Try to connect
                    test_client = ModelClient(host="localhost", port=self.server_port)
                    test_client.close()
                    print(f"[NITROGEN] Server ready on port {self.server_port}")
                    return True, f"NitroGen server started on port {self.server_port}"
                except:
                    await asyncio.sleep(1)
            
            return False, "Server startup timeout"
            
        except Exception as e:
            return False, f"Failed to start server: {str(e)}"
    
    async def stop_server(self) -> Tuple[bool, str]:
        """
        Stop the NitroGen inference server.
        
        Returns:
            (success, message)
        """
        if self.server_process is None:
            return True, "Server not running"
        
        try:
            self.server_process.terminate()
            self.server_process.wait(timeout=5)
            self.server_process = None
            return True, "Server stopped"
        except Exception as e:
            return False, f"Failed to stop server: {str(e)}"
    
    async def play_game(self, game_process_name: str, duration_seconds: Optional[int] = None, 
                       controller_type: str = "xbox", screenshot_backend: str = "dxcam") -> Tuple[bool, str]:
        """
        Start AI-powered game playing.
        
        Args:
            game_process_name: Name of game executable (e.g., "Minecraft.exe")
            duration_seconds: How long to play (None = until stopped)
            controller_type: "xbox" or "ps4"
            screenshot_backend: "dxcam" or "pyautogui"
        
        Returns:
            (success, message)
        """
        if self.is_playing:
            return False, "Already playing a game"
        
        try:
            # Ensure server is running
            if self.server_process is None:
                success, msg = await self.start_server()
                if not success:
                    return False, f"Failed to start server: {msg}"
            
            # Connect to server
            print(f"[NITROGEN] Connecting to inference server...")
            self.client = ModelClient(host="localhost", port=self.server_port)
            
            # Get game process info
            print(f"[NITROGEN] Looking for game process: {game_process_name}")
            proc_info = get_process_info(game_process_name)
            game_pid = proc_info["pid"]
            game_window_name = proc_info["window_name"]
            
            print(f"[NITROGEN] Found game: PID={game_pid}, Window='{game_window_name}'")
            
            # Setup gamepad emulator
            self.gamepad_emulator = GamepadEmulator(controller_type=controller_type, system="windows")
            
            # Find game window
            windows = pwc.getAllWindows()
            self.game_window = None
            for window in windows:
                if window.title == game_window_name:
                    self.game_window = window
                    break
            
            if not self.game_window:
                return False, f"Game window not found: {game_window_name}"
            
            # Activate window
            self.game_window.activate()
            l, t, r, b = self.game_window.left, self.game_window.top, self.game_window.right, self.game_window.bottom
            bbox = (l, t, r - l, b - t)
            
            # Setup screenshot backend
            if screenshot_backend == "dxcam":
                self.screenshot_backend = DxcamScreenshotBackend(bbox, fps=10)
            else:
                self.screenshot_backend = PyautoguiScreenshotBackend(bbox)
            
            # Reset session
            self.client.reset()
            
            # Start playing loop
            self.is_playing = True
            self.game_process_name = game_process_name
            
            # Run game loop in background
            asyncio.create_task(self._game_loop(duration_seconds))
            
            return True, f"Started playing {game_process_name}"
            
        except Exception as e:
            self.is_playing = False
            return False, f"Failed to start playing: {str(e)}"
    
    async def _game_loop(self, duration_seconds: Optional[int] = None):
        """Main game playing loop."""
        start_time = time.time()
        frame_count = 0
        
        try:
            while self.is_playing:
                # Check duration
                if duration_seconds and (time.time() - start_time) > duration_seconds:
                    print(f"[NITROGEN] Duration limit reached ({duration_seconds}s)")
                    break
                
                # Capture screenshot
                screenshot = self.screenshot_backend.screenshot()
                screenshot_array = np.array(screenshot)
                
                # Get prediction from NitroGen
                prediction = self.client.predict(screenshot_array)
                
                # Execute gamepad actions
                self.gamepad_emulator.step(prediction)
                
                frame_count += 1
                
                # Small delay to control FPS
                await asyncio.sleep(0.1)  # ~10 FPS
                
        except Exception as e:
            print(f"[NITROGEN] Game loop error: {e}")
        finally:
            self.is_playing = False
            if self.gamepad_emulator:
                self.gamepad_emulator.reset()
            print(f"[NITROGEN] Stopped playing after {frame_count} frames")
    
    async def stop_playing(self) -> Tuple[bool, str]:
        """
        Stop AI game playing.
        
        Returns:
            (success, message)
        """
        if not self.is_playing:
            return True, "Not currently playing"
        
        self.is_playing = False
        
        # Reset gamepad
        if self.gamepad_emulator:
            self.gamepad_emulator.reset()
        
        # Close client
        if self.client:
            self.client.close()
            self.client = None
        
        return True, f"Stopped playing {self.game_process_name}"
    
    def get_status(self) -> Dict:
        """
        Get current agent status.
        
        Returns:
            Status dictionary
        """
        return {
            "server_running": self.server_process is not None,
            "is_playing": self.is_playing,
            "game": self.game_process_name,
            "model_path": self.model_path,
            "server_port": self.server_port
        }


# Convenience function for testing
if __name__ == "__main__":
    async def test():
        agent = NitrogenAgent()
        
        # Start server
        success, msg = await agent.start_server()
        print(f"Start server: {success} - {msg}")
        
        if success:
            # Get status
            status = agent.get_status()
            print(f"Status: {status}")
            
            # Stop server
            success, msg = await agent.stop_server()
            print(f"Stop server: {success} - {msg}")
    
    asyncio.run(test())
