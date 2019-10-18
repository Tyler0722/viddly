import React, { useState, useEffect, useRef } from "react";
import adapter from "webrtc-adapter";
import { IncomingCall, Profile } from "components";

import useWebSocket from "hooks/useWebSocket";
import { useAuthState } from "context/auth";
import { api } from "helpers/api";

const mediaConstraints = {
  video: true,
  audio: false
};

const Join = (props) => {
  const { user } = useAuthState();

  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [call, setCall] = useState(undefined);
  const [remoteSessionDescription, setRemoteSessionDescription] = useState(undefined);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  // Peer connection stuff
  const handleICECandidate = (event) => {
    if (event.candidate) {
      send({
        type: "newIceCandidate",
        to: call ? call.participants[0] : profiles[index],
        candidate: event.candidate
      });
    }
  };

  const handleICEConnectionStateChange = (event) => {
    switch (peerConnectionRef.current.iceConnectionState) {
      case "closed":
      case "failed":
      case "disconnected":
        closeVideoCall();
        break;
    }
  };

  const handleSignalingStateChange = (event) => {
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
        send({
          from: user.id,
          to: profiles[index].id,
          type: "videoOffer",
          sdp: peerConnectionRef.current.localDescription
        });
      });
  };

  const handleTrack = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0];
  };

  const createPeerConnection = (clickedUser) => {
    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
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

  // WebSocket messages
  const handleNewRequest = ({ call }) => {
    setCall(call);
  };

  const handleVideoOffer = ({ call, sdp }) => {
    setCall(call);
    setRemoteSessionDescription(sdp);
  };

  const handleVideoAnswer = ({ sdp }) => {
    const description = new RTCSessionDescription(sdp);
    peerConnectionRef.current.setRemoteDescription(description);
  };

  const handleNewIceCandidate = ({ candidate }) => {
    candidate = new RTCIceCandidate(candidate);
    peerConnectionRef.current.addIceCandidate(candidate);
  };

  const handleMessage = (message) => {
    console.log(message);
    switch (message.type) {
      case "request":
        handleNewRequest(message);
        break;
      case "accept":
        setCall(message.call);
        break;
      case "videoOffer":
        handleVideoOffer(message);
        break;
      case "videoAnswer":
        handleVideoAnswer(message);
        break;
      case "newIceCandidate":
        handleNewIceCandidate(message);
        break;
    }
  };

  const webSocketUrl = "ws://localhost:5000";
  const options = {
    onMessage: handleMessage
  };
  const [send, readyState] = useWebSocket(webSocketUrl, options);

  const request = (event) => {
    if (peerConnectionRef.current) {
      alert("Call denied: Already in call");
      return;
    }

    const clickedUser = profiles[index].id;

    createPeerConnection(clickedUser);

    navigator.mediaDevices.getUserMedia(mediaConstraints).then((stream) => {
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, stream);
      });
    });
  };

  const getProfiles = () => {
    return api.get("/profile").then((response) => response.data.profile);
  };

  // load profiles
  useEffect(() => {
    getProfiles().then((profile) => {
      setProfiles(profile);
    });
  }, []);

  const prevProfile = () => {
    const newIndex = index === 0 ? 0 : index - 1;
    setIndex(newIndex);
  };

  const nextProfile = () => {
    const newIndex = index + 1;
    setIndex(newIndex);
    if (newIndex === profiles.length - 1) {
      getProfiles().then((profile) => {
        setProfiles(profiles.concat(profile));
      });
    }
  };

  const handleAccept = () => {
    const cloned = Object.assign({}, call);
    cloned.status = 1;
    setCall(cloned);

    if (peerConnectionRef.current === null) {
      createPeerConnection();
    }

    const description = new RTCSessionDescription(remoteSessionDescription);

    peerConnectionRef.current
      .setRemoteDescription(description)
      .then(() => navigator.mediaDevices.getUserMedia(mediaConstraints))
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current.addTrack(track, stream);
        });
        return peerConnectionRef.current.createAnswer();
      })
      .then((answer) => peerConnectionRef.current.setLocalDescription(answer))
      .then(() =>
        send({
          from: user.id,
          to: call.participants[0],
          type: "videoAnswer",
          sdp: peerConnectionRef.current.localDescription
        })
      );
  };

  const handleDecline = () => {};

  return (
    <>
      <IncomingCall
        participants={call ? call.participants.filter(({ id }) => id !== user.id) : []}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      <p>User id: {user.id}</p>
      <video autoPlay muted ref={localVideoRef} />
      <video autoPlay muted ref={remoteVideoRef} />
      <Profile profile={profiles[index]} />
      <button onClick={prevProfile}>Previous</button>
      <button onClick={request}>Request</button>
      <button onClick={nextProfile}>Next</button>
      <button onClick={closeVideoCall}>Close</button>
    </>
  );
};

export default Join;
