import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';

const WebRTCContext = createContext();

// Peer Connection configuration utilizing public Google STUN servers
const iceServersConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const WebRTCProvider = ({ children }) => {
  const { socket } = useSocket();

  // Call states: 'idle', 'calling' (outgoing call), 'incoming' (incoming call), 'connected' (active call)
  const [callState, setCallState] = useState('idle');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  // Remote Peer Details
  const [peerId, setPeerId] = useState(null);
  const [peerUsername, setPeerUsername] = useState('');

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pendingCandidates = useRef([]);

  // Signaling message coordinator
  useEffect(() => {
    if (!socket) return;

    const handleSignaling = async ({ fromUserId, fromUsername, type, payload }) => {
      switch (type) {
        case 'call-request':
          // Another user is calling us
          setPeerId(fromUserId);
          setPeerUsername(fromUsername);
          setCallState('incoming');
          console.log(`Incoming video call request from user ${fromUsername}`);
          break;

        case 'offer':
          // Received session capabilities offer
          setPeerId(fromUserId);
          setPeerUsername(fromUsername);
          setCallState('incoming');
          // Cache the offer inside peer connection state
          await handleRemoteOffer(payload, fromUserId);
          break;

        case 'answer':
          // Remote accepted our call offer
          if (pcRef.current) {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(payload));
            setCallState('connected');
            console.log('WebRTC Call Connected!');
          }
          break;

        case 'ice-candidate':
          // Received a connection path candidate
          if (pcRef.current && pcRef.current.remoteDescription) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(payload));
            } catch (err) {
              console.error('Error adding ICE candidate:', err);
            }
          } else {
            // Queue candidate until remote description is set
            pendingCandidates.current.push(payload);
          }
          break;

        case 'hangup':
          // Call declined or ended
          closeConnection();
          break;

        default:
          break;
      }
    };

    socket.on('webrtc-signaling', handleSignaling);

    return () => {
      socket.off('webrtc-signaling', handleSignaling);
    };
  }, [socket]);

  // Clean local/remote tracks and connections
  const closeConnection = () => {
    console.log('Terminating WebRTC call streams and connections');
    
    // Stop local video/audio tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    // Release remote stream reference
    remoteStreamRef.current = null;
    setRemoteStream(null);

    // Close Peer Connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    pendingCandidates.current = [];
    setPeerId(null);
    setPeerUsername('');
    setCallState('idle');
  };

  // Helper: Setup camera/microphone stream
  const captureLocalMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error acquiring media devices permissions:', error);
      alert('Could not open camera or microphone. Please check browser permissions.');
      throw error;
    }
  };

  // Helper: Create standard peer connection
  const createPeerConnection = (targetUserId) => {
    const pc = new RTCPeerConnection(iceServersConfig);
    
    // Handle ICE Candidate generation
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('webrtc-signaling', {
          toUserId: targetUserId,
          type: 'ice-candidate',
          payload: event.candidate
        });
      }
    };

    // Handle remote media track arrival
    pc.ontrack = (event) => {
      console.log('Received remote media track!');
      if (event.streams && event.streams[0]) {
        remoteStreamRef.current = event.streams[0];
        setRemoteStream(event.streams[0]);
      } else {
        // Fallback standard stream assembly
        if (!remoteStreamRef.current) {
          const stream = new MediaStream();
          remoteStreamRef.current = stream;
          setRemoteStream(stream);
        }
        remoteStreamRef.current.addTrack(event.track);
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // Outgoing call initiation
  const makeCall = async (targetUserId, targetUsername) => {
    setCallState('calling');
    setPeerId(targetUserId);
    setPeerUsername(targetUsername);

    try {
      const stream = await captureLocalMedia();
      const pc = createPeerConnection(targetUserId);

      // Add local media tracks to connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Generate call request ping to alert recipient
      socket.emit('webrtc-signaling', {
        toUserId: targetUserId,
        type: 'call-request',
        payload: null
      });
    } catch (err) {
      console.error(err);
      closeConnection();
    }
  };

  // Triggered when caller sends SDP offer
  const handleRemoteOffer = async (offerSDP, fromUserId) => {
    try {
      const pc = createPeerConnection(fromUserId);
      await pc.setRemoteDescription(new RTCSessionDescription(offerSDP));
      
      // Load pending candidates
      for (const candidate of pendingCandidates.current) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
      pendingCandidates.current = [];
    } catch (err) {
      console.error(err);
      closeConnection();
    }
  };

  // Accept incoming call request
  const acceptCall = async () => {
    if (!peerId || !socket) return;
    setCallState('connected');

    try {
      const stream = await captureLocalMedia();
      
      // If peer connection wasn't created yet (e.g. waiting for call request pick up)
      let pc = pcRef.current;
      if (!pc) {
        pc = createPeerConnection(peerId);
      }

      // Add local media tracks to connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // If call started as call-request, caller will now send SDP offer
      // Let's coordinate: caller creates offer when we accept call request
      socket.emit('webrtc-signaling', {
        toUserId: peerId,
        type: 'call-accepted',
        payload: null
      });

      // Listen to offer exchanges (or if offer was already received)
      if (pc.remoteDescription) {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc-signaling', {
          toUserId: peerId,
          type: 'answer',
          payload: answer
        });
      } else {
        // Coordinate caller to send offer
        socket.on('webrtc-signaling', async function handleCallerOffer({ type, payload }) {
          if (type === 'offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(payload));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc-signaling', {
              toUserId: peerId,
              type: 'answer',
              payload: answer
            });
            socket.off('webrtc-signaling', handleCallerOffer);
          }
        });
      }

    } catch (err) {
      console.error(err);
      closeConnection();
    }
  };

  // Reject / Hang up Call
  const declineOrHangup = () => {
    if (peerId && socket) {
      socket.emit('webrtc-signaling', {
        toUserId: peerId,
        type: 'hangup',
        payload: null
      });
    }
    closeConnection();
  };

  // Helper hook inside outgoing call requests: caller generates offer when recipient accepts call request
  useEffect(() => {
    if (!socket) return;

    const handleCallAccept = async ({ type, fromUserId }) => {
      if (type === 'call-accepted') {
        const pc = pcRef.current;
        if (pc && localStreamRef.current) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit('webrtc-signaling', {
            toUserId: fromUserId,
            type: 'offer',
            payload: offer
          });
          console.log('SDP call offer generated and sent!');
        }
      }
    };

    socket.on('webrtc-signaling', handleCallAccept);
    return () => {
      socket.off('webrtc-signaling', handleCallAccept);
    };
  }, [socket]);

  return (
    <WebRTCContext.Provider value={{
      callState,
      localStream,
      remoteStream,
      peerUsername,
      makeCall,
      acceptCall,
      declineCall: declineOrHangup,
      hangup: declineOrHangup
    }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
