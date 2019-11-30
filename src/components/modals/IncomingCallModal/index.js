import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import * as modalActions from "../../../actions/modals";

import { Avatar } from "components";

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledIncomingCall = styled.div`
  background-color: #fff;
  max-width: 38rem;
  border-radius: 8px;
  width: 100%;

  button {
    height: 5rem;
    width: 5rem;
    background-color: #0ed578;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button.hi {
    background-color: #fb5558;
  }

  svg {
    fill: #fff;
    width: 1.6rem;
    height: 1.6rem;
  }

  div {
    display: inline-flex;
    flex-flow: column;
    align-items: center;
    margin-right: 4rem;
  }

  div span {
  }
`;

const IncomingCallModal = (props) => {
  const {
    user,
    sessionDescription,
    peerConnection,
    createPeerConnection,
    localVideoRef,
    incomingCall,
    connection,
    closeModal,
    closeVideoCall
  } = props;

  const accept = () => {
    if (!peerConnection.current) {
      createPeerConnection();
    }

    console.log(sessionDescription);

    const desc = new RTCSessionDescription(sessionDescription);

    peerConnection.current
      .setRemoteDescription(desc)
      .then(() =>
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            localVideoRef.current.srcObject = stream;
            stream.getTracks().forEach((track) => {
              peerConnection.current.addTrack(track, stream);
            });
            return peerConnection.current.createAnswer();
          })
      )
      .then((answer) => peerConnection.current.setLocalDescription(answer))
      .then(() => {
        closeModal();
        connection.send({
          to: incomingCall.participants[0],
          type: "accept",
          sdp: peerConnection.current.localDescription
        });
      });
  };

  const decline = () => {
    closeModal();
    closeVideoCall();
  };

  return (
    <Overlay>
      <StyledIncomingCall>
        <Avatar size={80} user={user} />
        <p>Incoming call</p>
        <p>{user.username}</p>
        <div>
          <button onClick={accept}>
            <svg viewBox="0 0 45.701 45.7">
              <path
                d="M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504
			        c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0
			        c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z"
              />
            </svg>
          </button>
          <span>Accept</span>
        </div>
        <div>
          <button className="hi" onClick={decline}>
            <svg viewBox="0 0 41.756 41.756">
              <path
                d="M27.948,20.878L40.291,8.536c1.953-1.953,1.953-5.119,0-7.071c-1.951-1.952-5.119-1.952-7.07,0L20.878,13.809L8.535,1.465
		c-1.951-1.952-5.119-1.952-7.07,0c-1.953,1.953-1.953,5.119,0,7.071l12.342,12.342L1.465,33.22c-1.953,1.953-1.953,5.119,0,7.071
		C2.44,41.268,3.721,41.755,5,41.755c1.278,0,2.56-0.487,3.535-1.464l12.343-12.342l12.343,12.343
		c0.976,0.977,2.256,1.464,3.535,1.464s2.56-0.487,3.535-1.464c1.953-1.953,1.953-5.119,0-7.071L27.948,20.878z"
              />
            </svg>
          </button>
          <span>Decline</span>
        </div>
      </StyledIncomingCall>
    </Overlay>
  );
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => dispatch(modalActions.closeModal())
});

export default connect(
  null,
  mapDispatchToProps
)(IncomingCallModal);
