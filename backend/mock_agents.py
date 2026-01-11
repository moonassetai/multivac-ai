import asyncio
import json
import os
from pathlib import Path

class MockCadAgent:
    def __init__(self, on_thought=None, on_status=None):
        self.on_thought = on_thought
        self.on_status = on_status

    async def generate_prototype(self, prompt, output_dir=None):
        print(f"[MOCK CAD] Generating prototype for: {prompt}")
        if self.on_status:
            self.on_status({'status': 'generating', 'attempt': 1, 'max_attempts': 1})

        if self.on_thought:
            self.on_thought("Analyzing requirements... (Mock)\n")
            await asyncio.sleep(0.5)
            self.on_thought("Generating geometry... (Mock)\n")
            await asyncio.sleep(0.5)
            self.on_thought("Finalizing design... (Mock)\n")

        return {
            'file_path': 'mock_output.stl',
            'data': 'mock_binary_data',
            'vertices': [],
            'edges': []
        }

    async def iterate_prototype(self, prompt, output_dir=None):
        print(f"[MOCK CAD] Iterating prototype: {prompt}")
        return await self.generate_prototype(prompt, output_dir)

class MockPrinterAgent:
    def __init__(self):
        self.printers = {}

    async def discover_printers(self):
        return [{
            "name": "Demo Printer (Virtual)",
            "host": "192.168.1.100",
            "port": 80,
            "printer_type": "moonraker",
            "camera_url": None
        }]

    def add_printer_manually(self, name, host, port=80, printer_type="moonraker", camera_url=None):
        class MockPrinter:
            def __init__(self, name, host, port, printer_type):
                self.name = name
                self.host = host
                self.port = port
                self.printer_type = printer_type

            def to_dict(self):
                return {
                    "name": self.name,
                    "host": self.host,
                    "port": self.port,
                    "printer_type": self.printer_type,
                    "camera_url": None
                }

        p = MockPrinter(name, host, port, printer_type)
        self.printers[host] = p
        return p

    async def get_print_status(self, host):
        class MockStatus:
            def __init__(self):
                self.printer = "Demo Printer"
                self.state = "printing"
                self.progress_percent = 45.5
                self.time_remaining = "12m 30s"
                self.time_elapsed = "10m 00s"
                self.filename = "demo_cube.stl"
                self.temperatures = {
                    "hotend": {"current": 210, "target": 210},
                    "bed": {"current": 60, "target": 60}
                }

            def to_dict(self):
                return {
                    "printer": self.printer,
                    "state": self.state,
                    "progress_percent": self.progress_percent,
                    "time_remaining": self.time_remaining,
                    "time_elapsed": self.time_elapsed,
                    "filename": self.filename,
                    "temperatures": self.temperatures
                }

        return MockStatus()

    async def print_stl(self, stl_path, printer_name, profile=None, progress_callback=None, root_path=None):
        print(f"[MOCK PRINT] Printing {stl_path} on {printer_name}")
        if progress_callback:
            await progress_callback(10, "Slicing (Mock)...")
            await asyncio.sleep(0.5)
            await progress_callback(50, "Uploading (Mock)...")
            await asyncio.sleep(0.5)
            await progress_callback(100, "Starting Print (Mock)...")

        return {"status": "success", "message": "Print started on virtual printer."}

    def get_available_profiles(self):
        return ["Generic PLA", "Generic PETG"]

    async def _probe_printer_type(self, host, port):
        return "moonraker"

    def _resolve_file_path(self, path, root_path):
        return "mock_path.stl"

class MockKasaAgent:
    def __init__(self, known_devices=None):
        self.devices = {}
        self.devices["192.168.1.50"] = self._create_mock_device("Office Light", "192.168.1.50", "bulb")
        self.devices["192.168.1.51"] = self._create_mock_device("Living Room Plug", "192.168.1.51", "plug")

    def _create_mock_device(self, alias, ip, dtype):
        class MockDev:
            def __init__(self, alias, ip, dtype):
                self.alias = alias
                self.ip_address = ip
                self.model = "Mock Model"
                self.is_bulb = (dtype == "bulb")
                self.is_plug = (dtype == "plug")
                self.is_strip = False
                self.is_dimmer = False
                self.is_on = False
                self.brightness = 100
                self.is_color = True
                self.is_dimmable = True
                self.hsv = (0, 0, 100)

            async def turn_on(self):
                self.is_on = True

            async def turn_off(self):
                self.is_on = False

            async def update(self):
                pass

        return MockDev(alias, ip, dtype)

    async def initialize(self):
        pass

    async def discover_devices(self):
        return [
            {
                "ip": "192.168.1.50",
                "alias": "Office Light",
                "model": "Mock Bulb",
                "type": "bulb",
                "is_on": self.devices["192.168.1.50"].is_on
            },
            {
                "ip": "192.168.1.51",
                "alias": "Living Room Plug",
                "model": "Mock Plug",
                "type": "plug",
                "is_on": self.devices["192.168.1.51"].is_on
            }
        ]

    async def turn_on(self, ip):
        if ip in self.devices:
            await self.devices[ip].turn_on()
            return True
        return False

    async def turn_off(self, ip):
        if ip in self.devices:
            await self.devices[ip].turn_off()
            return True
        return False

    async def set_brightness(self, ip, brightness):
        if ip in self.devices:
            self.devices[ip].brightness = brightness
            return True
        return False

    async def set_color(self, ip, hsv):
        if ip in self.devices:
            self.devices[ip].hsv = hsv
            return True
        return False

class MockComputerControlAgent:
    async def execute_action(self, action, params):
        print(f"[MOCK COMPUTER] Executing {action} with {params}")
        return True, f"Executed {action} (Simulated)"

class MockWebAgent:
    async def run_task(self, prompt, update_callback=None):
        print(f"[MOCK WEB] Running task: {prompt}")
        if update_callback:
            # Send a fake screenshot
            await update_callback(None, "Navigating to page (Simulated)...")
            await asyncio.sleep(0.5)
            await update_callback(None, "Found information (Simulated).")
        return f"Simulated web search result for: {prompt}"
