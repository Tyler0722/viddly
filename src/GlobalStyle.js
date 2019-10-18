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
    font-family: ${(props) => props.theme.base.fontFamily};
    font-weight: 400;
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
