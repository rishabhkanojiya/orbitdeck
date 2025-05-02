import { BrowserRouter as Router, Redirect, Switch } from "react-router-dom";
import routes from "./Routes";
import AuthGuard from "./Guard/Auth";
import { Suspense } from "react";

const App = () => {
    return (
        <Router>
            <Suspense fallback={<></>}>
                <Switch>
                    {routes.map((route, index) => (
                        <AuthGuard key={index} {...route} />
                    ))}
                    <Redirect to="/" />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default App;
