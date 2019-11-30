import styled from "styled-components";

export const Avatar = styled.div.attrs({
  className: "Avatar"
})`
  height: ${({ size }) => size}px;
  width: ${({ size }) => size}px;
  border-radius: 4px;
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${(props) => props.src});
`;
