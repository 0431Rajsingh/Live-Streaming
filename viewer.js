import { database } from './firebase-config.js';
import { ref, push, onValue, set, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

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

export async function joinStream(statusCallback, errorCallback) {
  try {
    statusCallback("Initializing connection...");
    const pc = new RTCPeerConnection(servers);
    
    // Timeout if connection takes too long
    const connectionTimeout = setTimeout(() => {
      errorCallback(new Error("Connection timeout. Please try again."));
      remove(ref(database, `rooms/room1/viewers/${viewerId}`));
    }, 30000);

    const remoteVideo = document.createElement('video');
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    remoteVideo.muted = true;
    remoteVideo.controls = true;
    remoteVideo.style.width = '100%';
    document.getElementById('remoteVideos').appendChild(remoteVideo);

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
        statusCallback("Stream received!");
        remoteVideo.play().catch(e => console.log("Play attempt:", e));
      }
    };

    const viewerRef = push(ref(database, 'rooms/room1/viewers'));
    const viewerId = viewerRef.key;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        push(ref(database, `rooms/room1/viewers/${viewerId}/viewerCandidates`), 
          event.candidate.toJSON());
      }
    };

    const offer = await pc.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    });
    await pc.setLocalDescription(offer);
    
    await set(viewerRef, { 
      offer: { 
        type: offer.type, 
        sdp: offer.sdp 
      } 
    });

    // Listen for answer
    const answerUnsub = onValue(ref(database, `rooms/room1/viewers/${viewerId}/answer`), 
      async (snapshot) => {
        const answer = snapshot.val();
        if (answer) {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          statusCallback("Connected! Waiting for stream...");
        }
      });

    // Listen for ICE candidates
    const iceUnsub = onChildAdded(ref(database, 
      `rooms/room1/viewers/${viewerId}/broadcasterCandidates`), 
      async (candidateSnapshot) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidateSnapshot.val()));
      });

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      statusCallback(`Connection: ${state}`);
      
      if (state === 'connected') {
        clearTimeout(connectionTimeout);
        answerUnsub();
        iceUnsub();
      }
      
      if (state === 'failed') {
        errorCallback(new Error("Connection failed"));
        remove(ref(database, `rooms/room1/viewers/${viewerId}`));
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
    };

  } catch (err) {
    errorCallback(err);
  }
}