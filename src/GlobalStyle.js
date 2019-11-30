import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%;
  }

  body {
    background-color: #03060D;
    font-family: ${(props) => props.theme.base.fontFamily};
    font-weight: 400;
    font-size: 1.6rem;
  }

  button, input, textarea {
    color: inherit;
    font: inherit;
  }

  button:focus, input:focus, textarea:focus {
    outline: none;
  }

  img {
    vertical-align: middle;
  }

  ul {
    list-style: none;
  }
`;

export default GlobalStyle;
