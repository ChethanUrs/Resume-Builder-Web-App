# ElevateChat - Real-Time Chat & WebRTC Video Calling

ElevateChat is a modern, premium full-stack MERN web application facilitating secure private and group discussions, typing indicators, presence synchronizers, image/file sharing, and direct peer-to-peer WebRTC video calling.

---

## Technical Highlights

- **WebRTC Video Calling**: Real-time peer-to-peer audio and video streaming coordinated over STUN ice servers.
- **WebSocket Presence & Signals**: Built on a unified Express + Socket.IO server on Port 6000. Sockets monitor client presence states (online indicators, lastSeen logs), deliver message notifications, and route SDP signaling variables.
- **Shared Files Upload Pipeline**: Integrated `multer` uploader handles files and images, classifying media types, computing file size labels, and providing vector bubble links in active chats.
- **Scale-to-Fit Dual Panel View**: Side-by-side conversations grid that auto-scales view elements and tracks scrolling positions smoothly.
- **Emoji Panel Box**: Self-contained floating emoji selectors helping conversations remain active.
- **Auth Guards & DB Caches**: Encrypted password hashes mapped over Mongoose schemas, guarded behind JWT session tokens.

---

## Directory Structure

This repository isolates the chat codebase at the root level:
```text
.
├── backend\
│   ├── config\db.js           # Mongoose MongoDB connection helper
│   ├── middleware\auth.js     # JWT REST API validator middleware
│   ├── models\                # Mongoose User, Message, Conversation models
│   ├── routes\                # REST API controllers (login, register, search, logs)
│   ├── socket\connection.js   # Socket presence & WebRTC signaling relayer
│   ├── .env                   # Configuration secrets: PORT=6000, MONGO_URI, JWT_SECRET
│   ├── package.json           # Server dependencies list
│   └── server.js              # Unified Node HTTP + Socket server
│
└── frontend\
    ├── index.html             # HTML entry & SEO headers
    ├── tailwind.config.js     # Custom brand guidelines
    ├── postcss.config.js      # PostCSS pre-processors
    ├── package.json           # Client dependency lists
    └── src\
        ├── main.jsx           # App initiator
        ├── index.css          # Custom scrollbars, glass layers, typing dot keyframes
        ├── App.jsx            # Router and protected private view guards
        ├── context\           # Auth, Theme, Socket, and WebRTC Provider contexts
        ├── components\        # Sidebar list, Chat text area, Video modals, Group makers
        └── pages\             # Login form, Register form, Chat Dashboard panels
```

---

## Local Startup Instructions

### Step 1: Start Backend (Port 6000)
1. Ensure your local MongoDB community instance is running on `mongodb://localhost:27017` (database `chat-app` will be created automatically).
2. Open a terminal and start the server:
   ```bash
   cd backend
   npm run dev
   ```
   *Output logs:*
   `MongoDB Connected (Chat App): 127.0.0.1`  
   `Chat application server is running on port 6000`

### Step 2: Start Frontend (Port 5173)
1. Open another terminal and start the Vite dev bundle:
   ```bash
   cd frontend
   npm run dev
   ```
   *Output logs:*
   `➜  Local:   http://localhost:5173/`

### Step 3: Run E2E Chat
1. Open `http://localhost:5173` in a standard browser tab and sign up (e.g. user `Jane`).
2. Open `http://localhost:5173` in an incognito window and sign up (e.g. user `John`).
3. Search for each other using the sidebar search box and click to open a chat.
4. Type text messages (witness real-time presence green dots and typing indicator cues), click the paperclip icon to upload an image or PDF file, and click the camera icon to start a peer-to-peer WebRTC video stream call.
