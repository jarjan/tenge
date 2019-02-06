import styled, { createGlobalStyle } from "styled-components/macro";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: "Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #282c34;
    color: #ffffff;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
  }
`;

export const Tenge = styled("div")`
  min-height: 100vh;
  max-width: 620px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const TengeInput = styled("input")`
  font-family: monospace;
  border-radius: 3px;
  padding: 5px 1px;
  background: rgba(255, 255, 255, 0.8);
`;

export const TengeLabel = styled("label")`
  margin-left: 5px;
`;

export const TengeList = styled("dl")`
  clear: both;
  overflow: auto;

  dt {
    float: left;
    clear: both;
  }
  dd {
    float: right;
    font-family: monospace;
  }
`;
