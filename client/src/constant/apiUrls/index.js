import environment from "../../environment";

const deploymentUrl = "/deployment";

export const URLS = {
    registerUser: `${environment.AUTH_API_URL}/users`,
    loginUser: `${environment.AUTH_API_URL}/users/login`,
    logoutUser: `${environment.AUTH_API_URL}/user/logout`,
    resetPassword: `${environment.AUTH_API_URL}/users/renew_access`,
    me: `${environment.AUTH_API_URL}/me`,

    deployments: `${environment.API_URL}/${deploymentUrl}`,
    deployment: `${environment.API_URL}/${deploymentUrl}/:deploymentId`,
    deploymentAdd: `${environment.API_URL}/${deploymentUrl}/add`,
};
