export const sharedWebSockets = {};

export const connectionStatus = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};

export const createOrJoinSocket = (webSocketRef, url, setReadyState) => {
  if (sharedWebSockets[url] === undefined) {
    setReadyState(prev =>
      Object.assign({}, prev, { [url]: connectionStatus.CONNECTING })
    );
    const protocol = "json";
    sharedWebSockets[url] = new WebSocket(url, protocol);
  }
  webSocketRef.current = sharedWebSockets[url];
};

export const attachListeners = (webSocket, url, setReadyState, options) => {
  const { onMessage, onOpen, onClose, onError } = options;

  // call when message is received from server
  // webSocket.onmessage = event => {
  //   const message = JSON.parse(event.data);
  //   if (onMessage) {
  //     onMessage(message);
  //   }
  // };

  // call when a connection is established and ready to be used
  webSocket.onopen = event => {
    if (onOpen) {
      onOpen(event);
    }
    setReadyState(prev =>
      Object.assign({}, prev, { [url]: connectionStatus.OPEN })
    );
  };

  // called when a connection is closed
  webSocket.onclose = event => {
    if (onClose) {
      onClose(event);
    }
    setReadyState(prev =>
      Object.assign({}, prev, { [url]: connectionStatus.CLOSED })
    );
  };

  // called when an error is thrown
  webSocket.onerror = error => {
    if (onError) {
      onError(error);
    }
  };

  return () => {
    setReadyState(prev =>
      Object.assign({}, prev, { [url]: connectionStatus.CLOSING })
    );
    webSocket.close();
  };
};
