import React from "react";
import { Switch, Route } from "react-router-dom";

import GlobalStyle from "./GlobalStyle";

import Join from "views/Join";
import Login from "views/Login";
import GettingStarted from "views/GettingStarted";

/*
  https://viddly.gg/join/00033448
  https://viddly.gg/join
  https://viddly.gg/login (Login with Google account)
  https://viddly.gg/getting-started (Set username)
*/

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route component={GettingStarted} exact path="/getting-started" />
        <Route component={Login} path="/login" />
        <Route component={Join} path={["/join", "/join/:sessionId"]} />
      </Switch>
    </>
  );
};

export default App;
