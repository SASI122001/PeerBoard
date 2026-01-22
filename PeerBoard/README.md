# 🖊️🎥 PeerBoard – Collaborative Whiteboard + Video Chat

PixCollab is a **full-stack real-time collaboration app** that lets users:
- ✅ Draw together on a shared whiteboard
- ✅ Chat via peer-to-peer video call
- ✅ Use basic controls: toggle video/audio, drop call
- ✅ Join using WebSockets and WebRTC for low-latency performance

Perfect for remote teamwork, classrooms, interviews, or brainstorming sessions.

---

## 🚀 Features

### ✏️ Whiteboard
- Real-time collaborative drawing using `Socket.io`
- Broadcasts canvas updates to all users
- Supports brush, color, clear tools (extensible)

### 🎥 Video Chat
- Peer-to-peer video using **WebRTC**
- Toggle **camera** and **mic**
- **Drop call** option
- Auto connection via signaling with **Socket.io**

---

## 🧠 Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | React.js, WebRTC, HTML5 Canvas |
| Backend     | NestJS (Node.js, TypeScript)   |
| Real-Time   | Socket.io (WebSockets)         |
| Drawing     | HTML5 `<canvas>`               |
| Dev Tools   | npm, Node.js, VS Code          |

---

## 📁 Project Structure

pixcollab/
├── frontend/ # React App (Whiteboard + Video)
│ ├── src/
│ │ ├── components/
│ │ │ ├── CanvasBoard.js
│ │ │ └── VideoChat.js
│ │ ├── App.js
│ │ └── socket.js
├── backend/ # NestJS WebSocket Signaling Server
│ ├── src/
│ │ └── gateways/
│ │ └── app.gateway.ts
│ └── main.ts
└── README.md

2️⃣ Start the Backend (NestJS)

cd backend
npm install
npm run start:dev
Runs on: http://localhost:3001

3️⃣ Start the Frontend (React)

cd frontend
npm install
npm start
Runs on: http://localhost:3000

📌 Open two browser tabs to simulate two users.
🧪 How It Works
🔁 WebRTC + Socket.io
Socket.io is used to:

Join rooms

Send and receive signaling data: offer, answer, ICE candidates

Once signaling completes, WebRTC directly connects peers for:

Video/audio stream

Reduced latency, no server load

✍️ Whiteboard
Draw actions (mousedown, mousemove) emit coordinates

Socket.io broadcasts them to all peers

Canvas updates synchronously across clients

