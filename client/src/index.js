import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GlobalStyle } from "./GlobalStyle";
import Toast from "./components/Toast";
import { LoginProvider, ShowPopupProvider } from "./context/Provider";

ReactDOM.render(
    <ShowPopupProvider>
        <LoginProvider>
            <GlobalStyle />
            <App />
            <Toast />
        </LoginProvider>
    </ShowPopupProvider>,
    document.getElementById("root"),
);
