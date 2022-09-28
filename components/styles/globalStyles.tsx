import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

const GlobalStyle = createGlobalStyle`
  ${normalize}

  html,
  body {
    color: ${({ theme }) => theme.text.default};
    max-width: 1260px;
    padding: 0;
    margin: auto;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
  
  * {
    box-sizing: border-box;
  }

  ::-moz-selection {
    background: ${({ theme }) => theme.text.drag};
  }
  ::selection {
    background: ${({ theme }) => theme.text.drag};    
  }
`;

export default GlobalStyle;
