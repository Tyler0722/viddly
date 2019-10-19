import React from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import GlobalStyle from "./GlobalStyle";

import Login from "views/login";
import Finish from "views/finish";
import Join from "views/join";

import { completeSetup } from "helpers/completeSetup";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Switch>
        <Route component={Login} path="/login" />
        <Route component={Finish} exact path="/finish" />
        <Route component={completeSetup(Join)} path="/join" />
      </Switch>
    </>
  );
};

export default App;
