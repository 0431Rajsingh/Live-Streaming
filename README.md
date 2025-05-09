# Live-streaming 🔴

The **Video Streaming Website** enables real-time video broadcasting and viewing over the web. This project uses **WebRTC** for peer-to-peer streaming and **Firebase Realtime Database** for signaling, allowing a **streamer** to go live and multiple **viewers** to watch it simultaneously.

The goal is to create a fast, simple, and scalable live streaming experience using only front-end technologies without the need for media servers.

---

## Features 🌟

- 🎥 Real-time Video Broadcasting  
- 👀 Multiple Viewers Support  
- 🔔 Firebase-based Signaling  
- 💡 Simple and Clean UI  
- 📱 Responsive Design  
- 🚫 No Server-Side Code Required  

---

## Tech Stack 🔧

- HTML  
- CSS  
- JavaScript (Modules)  
- WebRTC  
- Firebase Realtime Database  

---

## How to Run ⚙️

To run this project locally or on a server, follow these steps:

1. ✅ Set up your project structure:

2. 📦 Add your Firebase Realtime Database credentials in `firebase-config.js`:
```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
```
3. 📡 Open index.html in your browser (you can use Live Server in VS Code or any HTTP server).

4. 🎬 Click Start Stream to begin broadcasting.

5. 👥 Open the same page in another tab or device and click Join Stream to start watching.

Future Improvements 🚀
1. 🔒 Firebase Auth for stream privacy

2. 🎙 Two-way video/audio (WebRTC DataChannels)

3. 📼 Stream recording or archiving

4. 🧑‍🤝‍🧑 Room management and private session links

5. 📡 Replace Firebase with a custom signaling server for more control

6. 🧪 ICE candidate handling (currently simplified)

Notes 📌

-> This is a one-way streaming app – only the streamer sends video/audio.

-> All peer connection logic is handled in streamer.js and viewer.js.

-> Firebase is used only for signaling (not actual media streaming).

-> STUN server is provided via Google's public STUN: stun:stun.l.google.com:19302.
