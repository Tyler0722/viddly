import React, { useState, useEffect, useRef, useCallback } from "react";
import queryString from "query-string";

import { createOrJoinSocket, attachListeners, connectionStatus } from "helpers/websocket";

const useWebSocket = (url, options = {}) => {
  const [readyState, setReadyState] = useState({});

  const webSocketRef = useRef(null);

  useEffect(() => {
    const { queryParams } = options;
    url += "?" + queryString.stringify(queryParams);
    createOrJoinSocket(webSocketRef, url, setReadyState);
    const listenersFunc = attachListeners(webSocketRef.current, url, setReadyState, options);
    return listenersFunc;
  }, []);

  const send = useCallback((message) => {
    if (webSocketRef) {
      message = JSON.stringify(message);
      webSocketRef.current.send(message);
    }
  });

  const readyStateFromUrl = readyState[url] !== undefined ? readyState[url] : connectionStatus.CONNECTING;

  return [send, readyStateFromUrl];
};

export default useWebSocket;
