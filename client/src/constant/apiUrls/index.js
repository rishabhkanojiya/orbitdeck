import environment from "../../environment";

const deploymentUrl = "deployment";

export const URLS = {
    registerUser: `${environment.AUTH_API_URL}/users`,
    loginUser: `${environment.AUTH_API_URL}/users/login`,
    logoutUser: `${environment.AUTH_API_URL}/users/logout`,
    resetPassword: `${environment.AUTH_API_URL}/tokens/renew_access`,
    me: `${environment.AUTH_API_URL}/me`,

    deployments: `${environment.CORE_API_URL}/${deploymentUrl}`,
    deployment: `${environment.CORE_API_URL}/${deploymentUrl}/:deploymentId`,
    deploymentAdd: `${environment.CORE_API_URL}/${deploymentUrl}/add`,
    deploymentStatus: `${environment.CORE_API_URL}/${deploymentUrl}/:deploymentId/status`,

    analyticsStats: `${environment.ANALYTICS_API_URL}/events/stats`,
    analyticsRecent: `${environment.ANALYTICS_API_URL}/events/recent`,
    analyticsErrors: `${environment.ANALYTICS_API_URL}/events/errors`,
    analyticsTimeline: `${environment.ANALYTICS_API_URL}/events/timeline`,
    analyticsComponentUsage: `${environment.ANALYTICS_API_URL}/events/component/usage`,
};
