import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "../socket";

const Video = () => {
  const userVideo = useRef();
  const partnerVideo = useRef();
  const [stream, setStream] = useState();
  const [peer, setPeer] = useState();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }

      socket.emit("join-room", "room1");

      socket.on("user-joined", ({ id }) => {
        const p = createPeer(id, socket.id, stream);
        setPeer(p);
      });

      socket.on("receive-signal", ({ signal, callerId }) => {
        const p = addPeer(signal, callerId, stream);
        setPeer(p);
      });

      socket.on("signal-returned", ({ signal }) => {
        peer.signal(signal);
      });
    });
  }, []);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", signal => {
      socket.emit("send-signal", { userToSignal, callerId, signal });
    });

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", signal => {
      socket.emit("return-signal", { signal, callerId });
    });

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      <video ref={userVideo} autoPlay playsInline muted width={400} />
      <video ref={partnerVideo} autoPlay playsInline width={400} />
    </div>
  );
};

export default Video;
