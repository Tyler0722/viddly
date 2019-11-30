import React from "react";
import { useAuthState } from "context/auth";

/**
 * Redirects user to /finish if account is incomplete
 * @param {React.Component} Component Comoponent to render if user account is complete
 */
export const completeSetup = (Component) => (props) => {
  const { user } = useAuthState();
  if (user.gender === null || user.username === null) {
    props.history.push("/finish");
    return null;
  }
  return <Component />;
};
