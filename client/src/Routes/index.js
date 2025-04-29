import React from "react";
import { routesObj } from "../common/constants";

const Home = React.lazy(() => import("../components/Home"));
const User = React.lazy(() => import("../components/User"));
const Auth = React.lazy(() => import("../components/Auth"));
const DeploymentForm = React.lazy(() =>
    import("../components/Deployment/Form"),
);

const routes = [
    {
        path: routesObj.auth,
        component: Auth,
        requiresAuth: false,
        isAuthPage: true,
        exact: false,
    },
    {
        path: routesObj.home,
        component: Home,
        requiresAuth: false,
        bgFetch: true,
        exact: true,
    },
    {
        path: routesObj.deploymentAdd,
        component: DeploymentForm,
        requiresAuth: true,
        bgFetch: true,
        exact: true,
    },
    // {
    //     path: "/deployment/:id",
    //     component: DeploymentDetail,
    //     requiresAuth: true,
    //     bgFetch: true,
    //     exact: true,
    // },
    {
        path: routesObj.me,
        component: User,
        requiresAuth: true,
        exact: true,
    },
];

export default routes;
