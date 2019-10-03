import React from "react";
import { decode } from "jsonwebtoken";

import { getCookie } from "helpers/cookie";

const AuthStateContext = React.createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "setUser":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

const initialState = {
  user: undefined,
  isAuthenticated: false
};

const AuthProvider = props => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  React.useEffect(() => {
    const { email, id, first_name, last_name } = decode(getCookie("tokenn"));
    dispatch({
      type: "setUser",
      payload: {
        email,
        id,
        first_name,
        last_name
      }
    });
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      {props.children}
    </AuthStateContext.Provider>
  );
};

const useAuthState = () => {
  const context = React.useContext(AuthStateContext);
  return context;
};

export { AuthProvider, useAuthState };
