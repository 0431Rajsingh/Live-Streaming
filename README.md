# Video-streaming 🔴

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
