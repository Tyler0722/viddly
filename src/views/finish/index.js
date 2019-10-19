import React, { useState } from "react";

import { useAuthState } from "context/auth";
import { GenderPicker } from "components";

const Finish = (props) => {
  const { user } = useAuthState();

  const [username, setUsername] = useState(user.username || "");
  const [gender, setGender] = useState(null);
  const [errors, setErrors] = useState({});

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    if (/^\S*$/.test(value)) {
      setErrors({
        ...errors,
        username: null
      });
      setUsername(value);
    }
  };

  const handleSelection = (gender) => {
    setGender(gender);
    setErrors({
      ...errors,
      gender: null
    });
  };

  const handleSave = () => {
    const errors = {};
    if (username.length < 3) {
      errors.username = "Username must be 3 or more characters";
    } else if (username.length > 18) {
      errors.username = "Username must be 18 or less characters";
    } else if (username.length === 0) {
      errors.username = "Username is required";
    }
    if (gender === null) {
      errors.gender = "Gender is required";
    }
    setErrors(errors);
  };

  return (
    <>
      <div>
        <label htmlFor="username">Username</label>
        <input
          autoComplete="off"
          disabled={user.username}
          id="username"
          name="username"
          onChange={handleUsernameChange}
          spellCheck="false"
          value={username}
        />
        <div>{errors.username}</div>
      </div>
      <div>
        <p>Select gender</p>
        <GenderPicker onSelect={handleSelection} />
        <div>{errors.gender}</div>
      </div>
      <button onClick={handleSave}>
        Save
      </button>
    </>
  );
};

export default Finish;
