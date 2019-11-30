import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${({ type }) => (type === "dark" ? "#0d1013" : "#5566FA")};
  border: none;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: block;
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 5rem;
  padding: 0 3rem;

  :disabled {
    opacity: 0.7;
  }
`;

const Button = (props) => {
  const { disabled, loading, children, ...remainingProps } = props;
  return (
    <StyledButton disabled={disabled || loading} {...remainingProps}>
      {children}
    </StyledButton>
  );
};

export default Button;
