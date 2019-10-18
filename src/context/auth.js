import React from "react";

import { api } from "helpers/api";

const AuthStateContext = React.createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return {
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false
};

const AuthProvider = (props) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  React.useEffect(() => {
    const handleResponse = (response) => {
      const user = response.data.user;
      dispatch({
        type: "setUser",
        payload: user
      });
    };

    api
      .get("/users/me")
      .then(handleResponse)
      .catch((error) => console.log(error.response));
  }, []);

  if (!state.isAuthenticated) {
    return null;
  }

  return <AuthStateContext.Provider value={state}>{props.children}</AuthStateContext.Provider>;
};

const useAuthState = () => {
  const context = React.useContext(AuthStateContext);
  return context;
};

export { AuthProvider, useAuthState };
