import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GlobalStyle } from "./GlobalStyle";
import Toast from "./components/Toast";
import { LoginProvider, ShowPopupProvider } from "./context/Provider";
import { ThemeProvider } from "styled-components";
import { theme } from "./assets/styles/theme";

ReactDOM.render(
    <ShowPopupProvider>
        <LoginProvider>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <App />
                <Toast />
            </ThemeProvider>
        </LoginProvider>
    </ShowPopupProvider>,
    document.getElementById("root"),
);
