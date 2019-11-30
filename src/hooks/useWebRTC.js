import React, { useRef } from "react";

export const useWebRTC = ({ connection, selectedProfileRef, localVideoRef, remoteVideoRef }) => {
  const peerConnectionRef = useRef();

  console.log(selectedProfileRef.current)

  const handleICECandidate = (event) => {
    if (event.candidate && selectedProfileRef.current) {
      connection.send({
        type: "newIceCandidate",
        to: selectedProfileRef.current.id,
        candidate: event.candidate
      });
    }
  };

  const handleICEConnectionStateChange = () => {
    switch (peerConnectionRef.current.iceConnectionState) {
      case "closed":
      case "failed":
      case "disconnected":
        closeVideoCall();
        break;
    }
  };

  const handleSignalingStateChange = () => {
    switch (peerConnectionRef.current.signalingState) {
      case "closed":
        closeVideoCall();
        break;
    }
  };

  const handleNegotiationNeeded = () => {
    peerConnectionRef.current
      .createOffer()
      .then((offer) => peerConnectionRef.current.setLocalDescription(offer))
      .then(() => {
        connection.send({
          to: selectedProfileRef.current.id,
          type: "call",
          sdp: peerConnectionRef.current.localDescription
        });
      });
  };

  const handleTrack = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  const createPeerConnection = () => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServer: [
        {
          urls: "turn:localhost:5000",
          username: "webrtc",
          credential: "turnserver"
        }
      ]
    });

    peerConnectionRef.current.onicecandidate = handleICECandidate;
    peerConnectionRef.current.oniceconnectionstatechange = handleICEConnectionStateChange;
    peerConnectionRef.current.onsignalingstatechange = handleSignalingStateChange;
    peerConnectionRef.current.onnegotiationneeded = handleNegotiationNeeded;
    peerConnectionRef.current.ontrack = handleTrack;
  };

  const closeVideoCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.oniceconnectionstatechange = null;
      peerConnectionRef.current.onicegatheringstatechange = null;
      peerConnectionRef.current.onsignalingstatechange = null;
      peerConnectionRef.current.onnegotiationneeded = null;
      peerConnectionRef.current.ontrack = null;

      peerConnectionRef.current.close();
      peerConnectionRef.current = null;

      localVideoRef.current.srcObject = null;
      remoteVideoRef.current.srcObject = null;
    }
  };

  return {
    peerConnection: peerConnectionRef,
    createPeerConnection,
    closeVideoCall
  };
};
