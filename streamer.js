import { database } from './firebase-config.js';
import { ref, push, onChildAdded, set, remove, onDisconnect } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

const localVideo = document.getElementById('localVideo');
let localStream;
const connections = {};

const servers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { 
      urls: 'turn:global.relay.metered.ca:80',
      username: 'your-turn-username',
      credential: 'your-turn-credential'
    }
  ]
};

export async function startStreaming(statusCallback, errorCallback) {
  try {
    statusCallback("Requesting camera access...");
    
    localStream = await navigator.mediaDevices.getUserMedia({ 
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: true 
    });
    
    localVideo.srcObject = localStream;
    statusCallback("Camera access granted. Waiting for viewers...");
    
    console.log("Local stream tracks:", localStream.getTracks());

    const roomRef = ref(database, 'rooms/room1/viewers');

    onChildAdded(roomRef, async (snapshot) => {
      const viewerId = snapshot.key;
      const viewerData = snapshot.val();
      
      if (!connections[viewerId] && viewerData.offer) {
        statusCallback(`New viewer: ${viewerId}`);
        const pc = new RTCPeerConnection(servers);
        connections[viewerId] = pc;

        // Add local stream tracks
        localStream.getTracks().forEach(track => {
          pc.addTrack(track, localStream);
        });

        // ICE Candidate handling
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const candidateRef = ref(database, `rooms/room1/viewers/${viewerId}/broadcasterCandidates`);
            push(candidateRef, event.candidate.toJSON());
          }
        };

        // Listen for viewer ICE candidates
        onChildAdded(ref(database, `rooms/room1/viewers/${viewerId}/viewerCandidates`), 
          async (candidateSnapshot) => {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(candidateSnapshot.val()));
            } catch (err) {
              console.error("Error adding ICE candidate:", err);
            }
          });

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(viewerData.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          await set(ref(database, `rooms/room1/viewers/${viewerId}/answer`), {
            type: answer.type,
            sdp: answer.sdp
          });
          
          statusCallback(`Streaming to ${viewerId}`);
        } catch (err) {
          errorCallback(new Error(`Negotiation error: ${err.message}`));
        }

        // Connection monitoring
        pc.onconnectionstatechange = () => {
          console.log(`Connection with ${viewerId}: ${pc.connectionState}`);
          if (pc.connectionState === 'connected') {
            // Set up cleanup on disconnect
            onDisconnect(ref(database, `rooms/room1/viewers/${viewerId}`)).remove();
          }
          if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
            delete connections[viewerId];
            remove(ref(database, `rooms/room1/viewers/${viewerId}`));
          }
        };
      }
    });
  } catch (err) {
    errorCallback(err);
  }
}