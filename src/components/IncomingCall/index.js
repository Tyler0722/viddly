import React from "react";

const IncomingCall = (props) => {
  const { participants, onAccept, onDecline } = props;
  // if (call === undefined || call.status !== 0) {
  //   return null;
  // }
  return (
    <div>
      <h1>Incoming call from {participants[0]}</h1>
      <button onClick={() => onAccept()}>Answer</button>
      <button onClick={() => onDecline()}>Decline</button>
    </div>
  );
};

export default IncomingCall;
