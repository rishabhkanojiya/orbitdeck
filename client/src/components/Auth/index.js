import React, { useEffect } from "react";
import {
    Redirect,
    Route,
    Switch,
    useHistory,
    useRouteMatch,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import { Consume } from "../../context/Consumer";
import { LoginContext } from "../../context";
import { routesObj } from "../../common/constants";

const Auth = ({ LoginData }) => {
    const history = useHistory();
    let { path } = useRouteMatch();

    useEffect(() => {
        if (LoginData?.data?.username) {
            history.push(routesObj.home);
        }
    }, []);

    const authRoutes = [
        {
            path: `${path}/login`,
            component: Login,
        },
        {
            path: `${path}/register`,
            component: Register,
        },
    ];
    return (
        <Switch>
            {authRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    component={route.component}
                    exact
                />
            ))}
            <Redirect to={`${path}/login`} />
        </Switch>
    );
};

export default Consume(Auth, [LoginContext]);
