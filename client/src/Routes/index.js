import React from "react";
import { routesObj } from "../common/constants";

const Home = React.lazy(() => import("../components/Home"));
const User = React.lazy(() => import("../components/User"));
const Auth = React.lazy(() => import("../components/Auth"));

const routes = [
    {
        path: routesObj.auth,
        component: Auth,
        requiresAuth: false,
        exact: false,
    },
    {
        path: routesObj.home,
        component: Home,
        requiresAuth: true,
        exact: true,
    },
    {
        path: routesObj.me,
        component: User,
        requiresAuth: true,
        exact: true,
    },
];

export default routes;
