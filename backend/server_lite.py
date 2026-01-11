import sys
import os
import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json

# Ensure we can import backend modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from brain_lite import LiteLoop

# Create a Socket.IO server
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = FastAPI()

# Add CORS for good measure
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global State (Note: In Serverless, this may reset, but useful for warm starts)
lite_loop = None

def get_loop():
    global lite_loop
    if lite_loop is None:
        # callbacks to emit to all (simpler than per-sid for lite demo)
        def on_message(text):
            asyncio.create_task(sio.emit('transcription', {'sender': 'Multivac', 'text': text}))

        def on_cad_data(data):
            asyncio.create_task(sio.emit('cad_data', data))

        def on_status(msg):
             asyncio.create_task(sio.emit('status', {'msg': msg}))

        def on_device_update(devs):
             asyncio.create_task(sio.emit('kasa_devices', devs))

        def on_project_update(name):
             asyncio.create_task(sio.emit('project_update', {'project': name}))

        lite_loop = LiteLoop(
            on_message=on_message,
            on_cad_data=on_cad_data,
            on_status=on_status,
            on_device_update=on_device_update,
            on_project_update=on_project_update
        )
    return lite_loop

@app.get("/api/status")
async def status():
    return {"status": "ok", "mode": "lite"}

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit('status', {'msg': 'Connected to Multivac Lite'}, room=sid)
    await sio.emit('auth_status', {'authenticated': True}) # Bypass auth for demo

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def user_input(sid, data):
    text = data.get('text')
    print(f"[LITE] User input: {text}")

    loop = get_loop()

    # Emit user text back for UI consistency
    # (Frontend usually adds it locally, but we confirm)
    # await sio.emit('transcription', {'sender': 'User', 'text': text})

    await loop.process_text(text)

@sio.event
async def start_audio(sid, data):
    # Just ack
    await sio.emit('status', {'msg': 'Multivac Lite Ready'})

@sio.event
async def discover_kasa(sid):
    loop = get_loop()
    devs = await loop.kasa_agent.discover_devices()
    await sio.emit('kasa_devices', devs)

@sio.event
async def discover_printers(sid):
    loop = get_loop()
    printers = await loop.printer_agent.discover_printers()
    await sio.emit('printer_list', printers)

# Wrap with Socket.IO
app = socketio.ASGIApp(sio, app)
