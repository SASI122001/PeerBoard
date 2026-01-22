import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "../socket";
import Video from "./Video";

const VideoChat = () => {
  const videoRef = useRef();
  const peersRef = useRef([]);
  const [peers, setPeers] = useState([]);
  const [stream, setStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const roomId = "demo-room";

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(currentStream => {
      setStream(currentStream);
      if (videoRef.current) videoRef.current.srcObject = currentStream;

      socket.emit("join-room", roomId);

      socket.on("user-joined", ({ id }) => {
        const peer = createPeer(id, socket.id, currentStream);
        peersRef.current.push({ peerID: id, peer });
        setPeers(users => [...users, { peerID: id, peer }]);
      });

      socket.on("receive-signal", ({ signal, callerId }) => {
        const peer = addPeer(signal, callerId, currentStream);
        peersRef.current.push({ peerID: callerId, peer });
        setPeers(users => [...users, { peerID: callerId, peer }]);
      });

      socket.on("signal-returned", ({ signal, id }) => {
        const peerObj = peersRef.current.find(p => p.peerID === id);
        if (peerObj) peerObj.peer.signal(signal);
      });
    });

    return () => socket.disconnect();
  }, []);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", signal => {
      socket.emit("send-signal", { userToSignal, callerId, signal });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", signal => {
      socket.emit("return-signal", { signal, callerId });
    });
    peer.signal(incomingSignal);
    return peer;
  }

  const toggleVideo = () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const track = stream.getAudioTracks()[0];
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
    }
  };

  const dropCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  };

  return (
    <div>
      <div>
        {stream && (
          <video ref={videoRef} autoPlay muted playsInline style={{ width: "400px" }} />
        )}
        {peers.map((peerObj, index) => (
          <Video key={index} peer={peerObj.peer} />
        ))}
      </div>

      <div className="controls">
        <button onClick={toggleVideo}>{videoEnabled ? "Turn Video Off" : "Turn Video On"}</button>
        <button onClick={toggleAudio}>{audioEnabled ? "Mute Mic" : "Unmute Mic"}</button>
        <button onClick={dropCall} style={{ backgroundColor: "#d9534f", color: "white" }}>
          Drop Call
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
