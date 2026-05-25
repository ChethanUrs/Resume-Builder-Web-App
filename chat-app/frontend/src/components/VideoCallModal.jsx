import React, { useRef, useEffect } from 'react';
import { useWebRTC } from '../context/WebRTCContext';
import { Phone, PhoneOff, Video, VideoOff } from 'lucide-react';

const VideoCallModal = () => {
  const { callState, localStream, remoteStream, peerUsername, acceptCall, declineCall, hangup } = useWebRTC();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Bind local stream to local video tag
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream to remote video tag
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      
      {/* Visual Call Interface Container */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[450px]">
        
        {/* Call Header Indicator */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {callState === 'calling' && 'Calling...'}
              {callState === 'incoming' && 'Incoming Call...'}
              {callState === 'connected' && 'Connected'}
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-white">{peerUsername || 'User'}</h3>
        </div>

        {/* Video Canvas Workspace */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-4 min-h-[300px]">
          
          {/* Main Display: Remote Stream or Placeholder */}
          <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center relative shadow-inner">
            {callState === 'connected' && remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-500">
                <div className="p-6 rounded-full bg-slate-800 animate-pulse-slow">
                  <Video className="h-8 w-8 text-slate-400" />
                </div>
                <span className="text-xs font-semibold">
                  {callState === 'calling' && `Waiting for ${peerUsername} to answer...`}
                  {callState === 'incoming' && `${peerUsername} is calling you...`}
                </span>
              </div>
            )}
          </div>

          {/* Picture-in-Picture: Local Camera Preview */}
          {localStream && (
            <div className="absolute bottom-8 right-8 w-32 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-slate-700 shadow-xl bg-slate-950 z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted // Mute own video player to prevent audio loop feedback
                className="w-full h-full object-cover scale-x-[-1]" // Flip camera horizontally for mirror view
              />
            </div>
          )}
        </div>

        {/* Call Action Bar */}
        <div className="p-6 bg-slate-950/60 border-t border-slate-800 flex justify-center items-center gap-4 z-10">
          {callState === 'incoming' ? (
            <>
              {/* Accept Call */}
              <button
                onClick={acceptCall}
                className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Phone className="h-4.5 w-4.5 fill-white stroke-none" />
                <span>Accept Call</span>
              </button>

              {/* Decline Call */}
              <button
                onClick={declineCall}
                className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-bold text-sm shadow-xl shadow-red-500/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <PhoneOff className="h-4.5 w-4.5 fill-white stroke-none" />
                <span>Decline</span>
              </button>
            </>
          ) : (
            /* Hangup Active/Outgoing Call */
            <button
              onClick={hangup}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-500 rounded-2xl text-white font-bold text-sm shadow-xl shadow-red-500/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              <PhoneOff className="h-4.5 w-4.5" />
              <span>End Call</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default VideoCallModal;
