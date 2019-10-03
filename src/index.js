import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import theme from "./theme";
import { AuthProvider } from "context/auth";

const MOUNT_NODE = document.getElementById("mount");

import "./style.css";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </ThemeProvider>,
  MOUNT_NODE
);
