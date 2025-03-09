import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import routes from "./Routes";
import AuthGuard from "./Guard/Auth";
import { Suspense } from "react";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    input: {
                        "&:-webkit-autofill": {
                            WebkitBoxShadow: "0 0 0 50px #121212 inset",
                            WebkitTextFillColor: "white",
                        },
                    },
                },
            },
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Router>
                <Suspense fallback={<></>}>
                    <Switch>
                        {routes.map((route, index) => (
                            <AuthGuard
                                key={index}
                                path={route.path}
                                component={route.component}
                                exact={route.exact}
                                requiresAuth={route.requiresAuth}
                            />
                        ))}
                        <Redirect to="/" />
                    </Switch>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
};

export default App;
