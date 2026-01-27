import uvicorn
import socketio
import random
import string
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. SETUP SOCKET.IO
# We use AsyncServer for high concurrency (production-ready)
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=['http://localhost:5173', 'http://127.0.0.1:5173'])
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Wrap FastAPI with socketio ASGI application
socket_app = socketio.ASGIApp(sio, app)

# 2. ROOM STATE MANAGEMENT
# This mimics the 'Room' interface from your TS code
class Room:
    def __init__(self):
        self.users = {}       # {socket_id: username}
        self.users_moves = {} # {socket_id: [MoveObjects]}
        self.drawed = []      # List of moves from users who left
    
    def to_dict(self):
        """Prepares data for the 'room' event (syncing state)"""
        return {
            "users": self.users,
            "usersMoves": self.users_moves,
            "drawed": self.drawed
        }

# Global dictionary to store rooms
rooms = {} # type: dict[str, Room]

# 3. HELPER FUNCTIONS
def generate_room_id():
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))

async def get_room_id(sid):
    """Finds the room ID a specific socket belongs to"""
    room_list = sio.rooms(sid)
    # The first room is always the socket's own ID, we want the second one
    for r in room_list:
        if r != sid:
            return r
    return sid

# 4. SOCKET EVENT HANDLERS
@sio.event
async def connect(sid, environ):
    print(f"Connected: {sid}")

@sio.on('create_room')
async def handle_create_room(sid, username):
    room_id = generate_room_id()
    while room_id in rooms:
        room_id = generate_room_id()
    
    await sio.enter_room(sid, room_id)
    
    new_room = Room()
    new_room.users[sid] = username
    new_room.users_moves[sid] = []
    rooms[room_id] = new_room
    
    await sio.emit('created', room_id, to=sid)

@sio.on('join_room')
async def handle_join_room(sid, room_id, username):
    if room_id in rooms and len(rooms[room_id].users) < 12:
        await sio.enter_room(sid, room_id)
        rooms[room_id].users[sid] = username
        rooms[room_id].users_moves[sid] = []
        await sio.emit('joined', room_id, to=sid)
    else:
        await sio.emit('joined', (None, True), to=sid)

@sio.on('joined_room')
async def handle_joined_room(sid):
    room_id = await get_room_id(sid)
    if room_id not in rooms: return

    room = rooms[room_id]
    
    # Send current room state to the new user
    # Note: JS uses Map formatting, Python dicts are fine as equivalents
    await sio.emit('room', {
        "room": { "drawed": room.drawed }, # Simplified for sync
        "usersMovesToParse": list(room.users_moves.items()), 
        "usersToParse": list(room.users.items())
    }, to=sid)

    # Notify others
    username = room.users.get(sid, 'Anonymous')
    await sio.emit('new_user', (sid, username), room=room_id, skip_sid=sid)

@sio.on('draw')
async def handle_draw(sid, move):
    room_id = await get_room_id(sid)
    if room_id not in rooms: return
    
    # Add timestamp and ID (replicates Node.js logic)
    move['timestamp'] = int(time.time() * 1000)
    # Note: In production, you'd generate a UUID here if not sent from client
    
    rooms[room_id].users_moves[sid].append(move)
    
    # Broadcast to others
    await sio.emit('user_draw', (move, sid), room=room_id, skip_sid=sid)
    # Confirm to sender
    await sio.emit('your_move', move, to=sid)

@sio.on('undo')
async def handle_undo(sid):
    room_id = await get_room_id(sid)
    if room_id in rooms and sid in rooms[room_id].users_moves:
        if len(rooms[room_id].users_moves[sid]) > 0:
            rooms[room_id].users_moves[sid].pop()
            await sio.emit('user_undo', sid, room=room_id, skip_sid=sid)

@sio.on('mouse_move')
async def handle_mouse_move(sid, x, y):
    room_id = await get_room_id(sid)
    await sio.emit('mouse_moved', (x, y, sid), room=room_id, skip_sid=sid)

@sio.on('disconnect')
async def handle_disconnect(sid):
    room_id = await get_room_id(sid)
    if room_id in rooms:
        room = rooms[room_id]
        # Move user's drawings to 'drawed' so they stay on board
        if sid in room.users_moves:
            room.drawed.extend(room.users_moves[sid])
            del room.users_moves[sid]
        
        if sid in room.users:
            del room.users[sid]
            
        await sio.emit('user_disconnected', sid, room=room_id)
        
        # Cleanup: if room empty, delete it
        if not room.users:
            del rooms[room_id]

if __name__ == "__main__":
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)
