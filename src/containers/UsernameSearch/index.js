import React, { useState } from "react";
import PropTypes from "prop-types";

const UsernameSearch = props => {
  const {
    autoFocus,
    defaultValue,
    disabled,
    id,
    onChange,
    placeholder,
    onValidationResult = () => {}
  } = props;

  const [username, setUsername] = useState(defaultValue || "");

  const isUsernameValid = username => {
    return username.length >= 3 && username.length <= 18;
  };

  const notifyParentWithValidationResult = username => {
    let error = undefined;
    let success = undefined;

    if (username.length > 18) {
      error = "Username must be less than 18 characters";
    } else if (username.length < 3) {
      error = "Username must be more than 2 characters";
    }

    onValidationResult({ error, success });
  };

  const search = username => {
    // check if username is available
    // (GET) https://api.viddly.gg/user?username=Tylerray0722
  };

  const handleChange = event => {
    const username = event.target.value.trim();

    setUsername(username);

    if (!isUsernameValid(username)) {
      return notifyParentWithValidationResult(username);
    }

    onValidationResult({ error: undefined, success: undefined });

    onChange(username);

    search(username);
  };

  return (
    <input
      autoFocus={autoFocus}
      disabled={disabled}
      id={id}
      onChange={handleChange}
      placeholder={placeholder}
      type="text"
      value={username}
    />
  );
};

UsernameSearch.propTypes = {};

export default UsernameSearch;
