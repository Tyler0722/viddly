import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import App from "./App";
import theme from "./theme";
import { AuthProvider } from "context/auth";
import getReducers from "./reducers";

const MOUNT_NODE = document.getElementById("mount");

import "./style.css";

const store = createStore(getReducers());

ReactDOM.render(
  <Provider store={store}>
		<ThemeProvider theme={theme}>
    	<AuthProvider>
      	<Router>
        	<App />
      	</Router>
    	</AuthProvider>
  	</ThemeProvider>
	</Provider>,
  MOUNT_NODE
);
