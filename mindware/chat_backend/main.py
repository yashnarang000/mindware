import asyncio
import json
import random
from typing import Dict, Set
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from motor.motor_asyncio import AsyncIOMotorClient
from decouple import config

# --- App & Database Setup ---
app = FastAPI()

# Loading the environment file
load_dotenv()
mongodb_link = os.getenv("MONGO_URI")

# MongoDB connection
MONGO_DETAILS = config("MONGO_DETAILS", default=mongodb_link)
client = AsyncIOMotorClient(MONGO_DETAILS)
db = client.peer_to_peer_app
messages_collection = db.get_collection("messages")


# --- In-memory storage for active users and rooms ---
class ConnectionManager:
    def __init__(self):
        # Maps room_id to set of user_ids
        self.rooms: Dict[str, Set[str]] = {
            "global": set(),
            "friends": set(),
        }
        # Maps user_id to WebSocket connection
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str, room_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        if room_id in self.rooms:
            self.rooms[room_id].add(user_id)
        else:  # Create new dynamic room
            self.rooms[room_id] = {user_id}
        await self.broadcast_user_list(room_id)

    async def disconnect(self, user_id: str, room_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        if room_id in self.rooms and user_id in self.rooms[room_id]:
            self.rooms[room_id].remove(user_id)
        await self.broadcast_user_list(room_id)

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)

    async def broadcast_to_room(self, message: str, room_id: str):
        if room_id in self.rooms:
            for user_id in self.rooms[room_id]:
                if user_id in self.active_connections:
                    await self.active_connections[user_id].send_text(message)

    async def broadcast_user_list(self, room_id: str):
        if room_id in self.rooms:
            user_list = list(self.rooms[room_id])
            message = json.dumps({"type": "user_list", "users": user_list})
            await self.broadcast_to_room(message, room_id)


manager = ConnectionManager()


# --- Helper for Anonymous Names ---
def generate_pseudonym():
    adjectives = ["Calm", "Brave", "Wise", "Happy", "Gentle", "Silent", "Swift"]
    nouns = ["Tiger", "Eagle", "River", "Sky", "Moon", "Sun", "Leaf"]
    return f"{random.choice(adjectives)}{random.choice(nouns)}{random.randint(10, 99)}"


# --- API Endpoints ---
@app.get("/", response_class=HTMLResponse)
async def get_index():
    # Serve a simple response for testing
    return HTMLResponse(content="<h1>Chat Backend is Running</h1>", status_code=200)


@app.get("/api/pseudonym")
async def get_pseudonym():
    """Generate and return a random pseudonym"""
    return {"pseudonym": generate_pseudonym()}


@app.get("/api/history/{room_id}")
async def get_chat_history(room_id: str):
    """Fetch last 50 public messages for a room"""
    messages = (
        await messages_collection.find({"room_id": room_id})
        .sort("_id", -1)
        .limit(50)
        .to_list(length=50)
    )

    # Reverse to show oldest first
    messages.reverse()

    for msg in messages:
        msg["_id"] = str(msg["_id"])  # convert ObjectId to string
    return {"type": "history", "messages": messages}


# --- WebSocket Endpoint ---
@app.websocket("/ws/{room_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, user_id: str):
    await manager.connect(websocket, user_id, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                # Handle different message types
                if message.get("type") == "get_history":
                    # Send chat history to the user
                    history = await get_chat_history(room_id)
                    await manager.send_personal_message(json.dumps(history), user_id)
                
                elif message.get("type") == "private_chat_request":
                    # Forward private chat invitation
                    request_message = json.dumps(
                        {"type": "private_chat_invitation", "from_user": user_id}
                    )
                    await manager.send_personal_message(
                        request_message, message["recipient_id"]
                    )
                
                elif message.get("type") == "private_message":
                    # Handle private messages
                    private_message = {
                        "type": "private_message",
                        "text": message["text"],
                        "user_id": user_id,
                        "recipient_id": message["recipient_id"],
                        "timestamp": datetime.now().strftime("%H:%M")
                    }
                    
                    # Save private message to database
                    await messages_collection.insert_one(dict(private_message))
                    
                    # Send to recipient
                    await manager.send_personal_message(
                        json.dumps(private_message), message["recipient_id"]
                    )
                    
                    # Send confirmation to sender
                    await manager.send_personal_message(
                        json.dumps(private_message), user_id
                    )
                
                else:  # Regular chat message
                    # Add metadata
                    message["user_id"] = user_id
                    message["room_id"] = room_id
                    message["timestamp"] = datetime.now().strftime("%H:%M")
                    
                    # Save to database if it's a public message
                    if not message.get("recipient_id"):
                        await messages_collection.insert_one(dict(message))
                    
                    # Broadcast to all users in the room
                    await manager.broadcast_to_room(json.dumps(message), room_id)
                    
            except json.JSONDecodeError:
                # Handle plain text messages
                message = {
                    "text": data,
                    "user_id": user_id,
                    "room_id": room_id,
                    "timestamp": datetime.now().strftime("%H:%M")
                }
                
                # Save to database
                await messages_collection.insert_one(dict(message))
                
                # Broadcast to all users in the room
                await manager.broadcast_to_room(json.dumps(message), room_id)

    except WebSocketDisconnect:
        await manager.disconnect(user_id, room_id)
        # Removed the disconnect message broadcast
