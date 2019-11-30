import React, { useCallback, useState, useEffect, useRef } from "react";
import adapter from "webrtc-adapter";
import { Profile, ProfileCard } from "components";
import { connect } from "react-redux";

import * as modalActions from "../../actions/modals";

import { useWebSocket } from "hooks/useWebSocket";
import { useWebRTC } from "hooks/useWebRTC";
import { useAuthState } from "context/auth";
import { api } from "helpers/api";

import styled from "styled-components";

const MEDIA_CONSTRAINTS = {
  video: true,
  audio: false
};

const fetchProfiles = () => {
  return api.get("/profile").then((response) => response.data.profile);
};

const Discover = (props) => {
  const { openModal } = props;

  const { user } = useAuthState();

  const [profiles, setProfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [time, setTime] = useState(0);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const selectedProfileRef = useRef();

  const connection = useWebSocket("ws://localhost:5000");
  const { peerConnection, createPeerConnection, closeVideoCall } = useWebRTC({
    connection,
    selectedUser: selectedProfileRef.current,
    selectedProfileRef,
    localVideoRef,
    remoteVideoRef
  });

  useEffect(() => {
    if (!connection.webSocketRef) {
      return;
    }
    connection.webSocketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "incomingCall":
          openModal("INCOMING_CALL", {
            closeVideoCall,
            user,
            peerConnection,
            createPeerConnection,
            localVideoRef,
            incomingCall: message.call,
            connection,
            sessionDescription: message.sdp
          });
          break;
        case "callAccepted":
          const desc = new RTCSessionDescription(message.sdp);
          peerConnection.current.setRemoteDescription(desc);
          break;
        case "newIceCandidate":
          if (peerConnection.current) {
            const candidate = new RTCIceCandidate(message.candidate);
            peerConnection.current.addIceCandidate(candidate);
          }
          break;
        case "callUpdated":
          setTime(75);
          break;
      }
    };
  }, [connection.webSocketRef, time]);

  useEffect(() => {
    fetchProfiles().then((profiles) => setProfiles(profiles));
  }, []);

  const call = (user) => {
    selectedProfileRef.current = user;
    createPeerConnection();
    navigator.mediaDevices.getUserMedia(MEDIA_CONSTRAINTS).then((stream) => {
      localVideoRef.current.srcObject = stream;
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });
    });
  };

  const padNum = (num) => ("0" + num).slice(-2);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60),
      secs = seconds % 60;
    return `${padNum(mins)}:${padNum(secs)}`;
  };

  return (
    <>
      {/* <video autoPlay muted ref={localVideoRef} />
      <video autoPlay muted ref={remoteVideoRef} />
      <button onClick={call}>Request</button> */}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  openModal: (modalType, modalProps) =>
    dispatch(modalActions.openModal(modalType, modalProps))
});

export default connect(
  null,
  mapDispatchToProps
)(Discover);
