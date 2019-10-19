import React, { useState } from "react";
import styled, { css } from "styled-components";

export const GENDERS = ["male", "female", "other"];

export const StyledGender = styled.div`
  cursor: pointer;
  display: inline-block;
  margin-right: 3rem;

  ${({ selected }) =>
    selected
      ? css`
          background-color: lightgray;
        `
      : null};
`;

const GenderPicker = (props) => {
  const { onSelect } = props;
  const [selectedGender, setSelectedGender] = useState(null);

  const renderGenders = () => {
    return GENDERS.map((gender, index) => (
      <StyledGender
        key={index}
        onClick={() => {
          setSelectedGender(gender);
          if (typeof onSelect === "function") {
            onSelect(gender);
          }
        }}
        selected={selectedGender === gender}
      >
        {gender}
      </StyledGender>
    ));
  };

  return <div>{renderGenders()}</div>;
};

export default GenderPicker;
