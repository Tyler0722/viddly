import React, { useState, useEffect } from "react";
import queryString from "query-string";

import { CLIENT_URL, GOOGLE_LOGIN_URL } from "helpers/constants";

const Login = props => {
  const { redirectUrl, location } = props;

  let r;

  if (location) {
    const searchObj = queryString.parse(location.search);
    r = searchObj.r;
  }

  const postRedirectUrl =
    redirectUrl !== undefined || r !== undefined
      ? redirectUrl || r
      : CLIENT_URL;

  return (
    <>
      <a href={GOOGLE_LOGIN_URL + "?redirect_uri=" + postRedirectUrl}>
        Log in with Google
      </a>
    </>
  );
};

export default Login;
