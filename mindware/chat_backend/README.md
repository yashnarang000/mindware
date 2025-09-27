# Mindware Chat Backend

This is the WebSocket-based chat backend for the Mindware peer-to-peer support feature.

## Features
- Real-time messaging using WebSockets
- Global chat room
- Friends chat room
- Message history storage in MongoDB
- User presence tracking

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (optional):
```bash
export MONGO_DETAILS="mongodb://localhost:27017"
export CHAT_PORT=8001
```

3. Run the server:
```bash
python startup.py
```

## API Endpoints

- `GET /api/pseudonym` - Generate a random pseudonym
- `GET /api/history/{room_id}` - Get message history for a room
- `WebSocket /ws/{room_id}/{user_id}` - WebSocket connection endpoint

## WebSocket Message Format

### Incoming Messages
```json
{
  "text": "Hello, world!",
  "recipient_id": "optional_user_id_for_private_messages"
}
```

### Outgoing Messages
```json
{
  "user_id": "user_xyz123",
  "room_id": "global",
  "text": "Hello, world!",
  "timestamp": "2023-01-01T12:00:00"
}
```

## Rooms
- `global` - Public chat room for all users
- `friends` - Private chat room for friends