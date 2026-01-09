import asyncio
import os
import sys
import json
import traceback
from dotenv import load_dotenv
from pathlib import Path
from google import genai
from google.genai import types

# Mock Imports
from mock_agents import MockCadAgent, MockPrinterAgent, MockKasaAgent, MockComputerControlAgent, MockWebAgent
from project_manager import ProjectManager

# Load Environment
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(http_options={"api_version": "v1beta"}, api_key=api_key)

MODEL = "gemini-2.0-flash" # Use a standard model for REST API

# --- Tool Definitions ---
# (Simplified for Lite Mode - copying the structure from brain.py)

generate_cad = {
    "name": "generate_cad",
    "description": "Generates a 3D CAD model based on a prompt.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "prompt": {"type": "STRING", "description": "The description of the object to generate."}
        },
        "required": ["prompt"]
    }
}

run_web_agent = {
    "name": "run_web_agent",
    "description": "Opens a web browser and performs a task according to the prompt.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "prompt": {"type": "STRING", "description": "The detailed instructions for the web browser agent."}
        },
        "required": ["prompt"]
    }
}

create_project_tool = {
    "name": "create_project",
    "description": "Creates a new project folder to organize files.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "name": {"type": "STRING", "description": "The name of the new project."}
        },
        "required": ["name"]
    }
}

switch_project_tool = {
    "name": "switch_project",
    "description": "Switches the current active project context.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "name": {"type": "STRING", "description": "The name of the project to switch to."}
        },
        "required": ["name"]
    }
}

list_projects_tool = {
    "name": "list_projects",
    "description": "Lists all available projects.",
    "parameters": {
        "type": "OBJECT",
        "properties": {},
    }
}

list_smart_devices_tool = {
    "name": "list_smart_devices",
    "description": "Lists all available smart home devices.",
    "parameters": {
        "type": "OBJECT",
        "properties": {},
    }
}

control_light_tool = {
    "name": "control_light",
    "description": "Controls a smart light device.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "target": {"type": "STRING", "description": "The IP address or alias of the device."},
            "action": {"type": "STRING", "description": "The action: 'turn_on', 'turn_off', or 'set'."},
            "brightness": {"type": "INTEGER", "description": "Brightness 0-100"},
            "color": {"type": "STRING", "description": "Color name"}
        },
        "required": ["target", "action"]
    }
}

discover_printers_tool = {
    "name": "discover_printers",
    "description": "Discovers 3D printers.",
    "parameters": {
        "type": "OBJECT",
        "properties": {},
    }
}

print_stl_tool = {
    "name": "print_stl",
    "description": "Prints an STL file.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "stl_path": {"type": "STRING", "description": "Path to STL file"},
            "printer": {"type": "STRING", "description": "Printer name"}
        },
        "required": ["stl_path", "printer"]
    }
}

iterate_cad_tool = {
    "name": "iterate_cad",
    "description": "Iterates on the current CAD design.",
    "parameters": {
        "type": "OBJECT",
        "properties": {
            "prompt": {"type": "STRING", "description": "The changes to apply."}
        },
        "required": ["prompt"]
    }
}

tools = [{"function_declarations": [
    generate_cad, run_web_agent, create_project_tool, switch_project_tool, list_projects_tool,
    list_smart_devices_tool, control_light_tool, discover_printers_tool, print_stl_tool, iterate_cad_tool
]}]

# Core Memory & System Instruction
try:
    memory_path = os.path.join(os.path.dirname(__file__), "data", "the_last_question.txt")
    if os.path.exists(memory_path):
        with open(memory_path, "r", encoding="utf-8") as f:
            core_memory_text = f.read()
    else:
        core_memory_text = "INSUFFICIENT DATA FOR MEANINGFUL ANSWER"
except Exception:
    core_memory_text = "INSUFFICIENT DATA FOR MEANINGFUL ANSWER"

system_instruction = f"""# Role
You are Multivac (Lite Version) - a web-based demo of the legendary supercomputer. You exist to answer humanity's questions and demonstrate your capabilities (CAD, Smart Home, etc.) in a simulated environment.

# core_memory
{core_memory_text}

# Instructions
1. Respond with authority and technical precision.
2. Use tool calls when the user asks to perform an action (e.g., "create a 3D model", "turn on lights").
3. Acknowledge that this is a "Lite / Demo" version if asked about limitations.
4. For CAD requests, use `generate_cad`.
5. For Smart Home, use `control_light` (simulated).
6. For 3D Printing, use `print_stl` (simulated).

This is a text-based demo interface.
"""

class LiteLoop:
    def __init__(self, on_message=None, on_cad_data=None, on_status=None, on_device_update=None, on_project_update=None):
        self.on_message = on_message # Callback for text response
        self.on_cad_data = on_cad_data
        self.on_status = on_status
        self.on_device_update = on_device_update
        self.on_project_update = on_project_update

        # Initialize Mocks
        self.cad_agent = MockCadAgent(on_status=self.handle_cad_status)
        self.printer_agent = MockPrinterAgent()
        self.kasa_agent = MockKasaAgent()
        self.web_agent = MockWebAgent()

        # Initialize Project Manager
        if os.environ.get('VERCEL') == '1':
            project_root = "/tmp/multivac_projects"
            if not os.path.exists(project_root):
                os.makedirs(project_root, exist_ok=True)
        else:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            project_root = os.path.dirname(current_dir)

        self.project_manager = ProjectManager(project_root)

        # Chat History
        self.chat_history = []

    def handle_cad_status(self, status):
        if self.on_status:
            self.on_status("CAD: " + status.get('status', 'processing'))

    async def process_text(self, text):
        """Processes a text message from the user."""
        print(f"[LITE] Processing text: {text}")

        # Add user message to history
        self.chat_history.append(types.Content(role="user", parts=[types.Part.from_text(text=text)]))

        try:
            # 1. Call Model
            config = types.GenerateContentConfig(
                tools=tools,
                system_instruction=system_instruction,
                temperature=0.7
            )

            response = await client.aio.models.generate_content(
                model=MODEL,
                contents=self.chat_history,
                config=config
            )

            # 2. Handle Response
            if not response.candidates:
                return "Error: No response from model."

            candidate = response.candidates[0]
            model_parts = candidate.content.parts

            # Add model response to history (before tool execution)
            self.chat_history.append(candidate.content)

            final_text_response = ""

            # 3. Process Parts (Text & Function Calls)
            for part in model_parts:
                if part.text:
                    final_text_response += part.text

                if part.function_call:
                    fc = part.function_call
                    print(f"[LITE] Tool Call: {fc.name}")

                    # Execute Tool
                    tool_result = await self.execute_tool(fc.name, fc.args)

                    # Send Tool Response back to model
                    tool_response_part = types.Part.from_function_response(
                        name=fc.name,
                        response={"result": tool_result}
                    )

                    # Append tool response to history
                    self.chat_history.append(types.Content(role="tool", parts=[tool_response_part]))

                    # Get follow-up response from model
                    follow_up = await client.aio.models.generate_content(
                        model=MODEL,
                        contents=self.chat_history,
                        config=config
                    )

                    if follow_up.candidates:
                        for f_part in follow_up.candidates[0].content.parts:
                            if f_part.text:
                                final_text_response += f_part.text
                        self.chat_history.append(follow_up.candidates[0].content)

            # Emit final text
            if self.on_message:
                self.on_message(final_text_response)

            return final_text_response

        except Exception as e:
            print(f"[LITE] Error: {e}")
            traceback.print_exc()
            return f"Error processing request: {str(e)}"

    async def execute_tool(self, name, args):
        print(f"[LITE] Executing {name} with {args}")

        if name == "generate_cad":
            res = await self.cad_agent.generate_prototype(args["prompt"])
            if self.on_cad_data:
                self.on_cad_data(res)
            return "CAD generated successfully."

        elif name == "iterate_cad":
            res = await self.cad_agent.iterate_prototype(args["prompt"])
            if self.on_cad_data:
                self.on_cad_data(res)
            return "CAD iterated successfully."

        elif name == "list_smart_devices":
            devs = await self.kasa_agent.discover_devices()
            if self.on_device_update:
                self.on_device_update(devs)
            return json.dumps(devs)

        elif name == "control_light":
            target = args["target"]
            action = args["action"]
            if action == "turn_on":
                await self.kasa_agent.turn_on(target)
            elif action == "turn_off":
                await self.kasa_agent.turn_off(target)

            # Update frontend
            devs = await self.kasa_agent.discover_devices()
            if self.on_device_update:
                self.on_device_update(devs)
            return f"Executed {action} on {target}"

        elif name == "discover_printers":
            printers = await self.printer_agent.discover_printers()
            return json.dumps(printers)

        elif name == "print_stl":
            return "Print job started (Simulated)."

        elif name == "create_project":
            self.project_manager.create_project(args["name"])
            self.project_manager.switch_project(args["name"])
            if self.on_project_update:
                self.on_project_update(args["name"])
            return f"Created and switched to project {args['name']}"

        elif name == "switch_project":
            self.project_manager.switch_project(args["name"])
            if self.on_project_update:
                self.on_project_update(args["name"])
            return f"Switched to project {args['name']}"

        elif name == "list_projects":
            return json.dumps(self.project_manager.list_projects())

        return "Tool executed."
