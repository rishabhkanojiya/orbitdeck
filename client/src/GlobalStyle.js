import styled, { createGlobalStyle, css } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  /* CSS Reset - clean default browser styles */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    width: 100%;
    height: 100%;
    font-family: 'Inter', 'Roboto', 'Helvetica Neue', 'Segoe UI', 'Arial', sans-serif;
    background-color: #0E0E10;
    color: #F4F4F5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    background: none;
    border: none;
    outline: none;
  }

  input, textarea, select {
    font-family: inherit;
    background: none;
    border: none;
    outline: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #2C2C2E;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const commonStyles = css`
    /* You can define reusable common styles here */
`;
