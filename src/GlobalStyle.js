import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${({ theme }) => theme.colors.white};
    font-family: ${({ theme }) => theme.base.fontFamily};
    font-weight: 400;
    height: 100%;
    user-select: none;
  }

  button, input, textarea {
    color: inherit;
    font: inherit;
  }

  button:focus, input:focus, textarea:focus {
    outline: none;
  }

  img {
    display: block;
  }

  ul {
    list-style: none;
  }
`;

export default GlobalStyle;
