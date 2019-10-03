import React, { useState, useEffect, useRef } from "react";

import { log } from "helpers/log";
import useWebSocket from "hooks/useWebSocket";

const Join = props => {
  // get session id to join existing session with user if it exist
  const sessionId = props.match.params.sessionId;

  const [userID, setUserID] = useState(null);
  const [session, setSession] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const peerConnectionRef = useRef(null);

  const handleVideoOffer = message => {
    log("Received request offer from", message.sender);

    if (peerConnectionRef.current === null) {
      createPeerConnection();
    }

    const description = new RTCSessionDescription(message.sdp);

    peerConnectionRef.current
      .setRemoteDescription(description)
      .then(() => {
        return navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });
        return peerConnectionRef.current.createAnswer();
      })
      .then(answer => {
        return peerConnectionRef.current.setLocalDescription(answer);
      })
      .then(() =>
        send({
          sender: message.target,
          target: message.sender,
          type: "video-answer",
          sdp: peerConnectionRef.current.localDescription
        })
      )
      .catch(error => console.log(error.message));
  };

  const handleVideoAnswer = message => {
    console.log("Call recipient has accepted your call");
    const description = new RTCSessionDescription(message.sdp);
    peerConnectionRef.current.setRemoteDescription(description);
  };

  const handleNewIceCandidate = message => {
    const candidate = new RTCIceCandidate(message.candidate);
    log("Adding received ice candidate", JSON.stringify(candidate));
    peerConnectionRef.current.addIceCandidate(candidate);
  };

  // Peer Connection stuff
  const createPeerConnection = clickedUser => {
    log("Setting up peer connection...");

    peerConnectionRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: "turn:localhost:5000",
          username: "webrtc",
          credential: "turnserver"
        }
      ]
    });

    peerConnectionRef.current.onicecandidate = event => {
      if (event.candidate) {
        send({
          type: "new-ice-candidate",
          target: clickedUser,
          candidate: event.candidate
        });
      }
    };
    peerConnectionRef.current.oniceconnectionstatechange = null;
    peerConnectionRef.current.onicegatheringstatechange = event => {
      log(
        "***ICE gathering state changed to:",
        peerConnectionRef.current.iceGatheringState
      );
    };
    peerConnectionRef.current.onsignalingstatechange = null;
    peerConnectionRef.current.onnegotiationneeded = () => {
      log("Negotiation needed");

      if (peerConnectionRef.current.signalingState != "stable") {
        log("The connection isnt stable yet; postpoing...");
        return;
      }

      peerConnectionRef.current
        .createOffer()
        .then(offer => {
          return peerConnectionRef.current.setLocalDescription(offer);
        })
        .then(() => {
          send({
            sender: userID,
            target: clickedUser,
            type: "video-offer",
            sdp: peerConnectionRef.current.localDescription
          });
        });
    };
    peerConnectionRef.current.ontrack = event => {
      log("Handle track event");
      console.log(event);
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  const handleMessage = message => {
    switch (message.type) {
      case "joined_session":
        setSession(message.session);
        break;
      case "userid":
        setUserID(message.id);
        break;
      case "userlist":
        setUsers(message.users);
        break;
      case "video-offer":
        handleVideoOffer(message);
        break;
      case "video-answer":
        handleVideoAnswer(message);
        break;
      case "new-ice-candidate":
        handleNewIceCandidate(message);
        break;
    }
  };

  const webSocketUrl = "ws://localhost:5000";
  const options = {
    onMessage: handleMessage,
    queryParams: {
      sessionId
    }
  };
  const [send, readyState] = useWebSocket(webSocketUrl, options);

  const call = event => {
    if (peerConnectionRef.current) {
      alert("Call denied: Already in call");
      return;
    }

    const clickedUser = event.currentTarget.textContent;

    log("Call started with", clickedUser);
    createPeerConnection(clickedUser);

    const constraints = {
      video: true,
      audio: false
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => {
          peerConnectionRef.current.addTrack(track, stream);
        });
      })
      .catch(error => {
        log(error);
      });
  };

  const renderList = () => {
    if (session === null) {
      return null;
    }
    return (
      <ul>
        {session.users.map(({ id, username }) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    );
  };

  if (session === null) {
    return null;
  }

  return (
    <>
      <p>Session id: {session.id}</p>
      {renderList()}
      <video autoPlay muted ref={localVideoRef} />
      <video autoPlay muted ref={remoteVideoRef} />
    </>
  );
};

export default Join;
