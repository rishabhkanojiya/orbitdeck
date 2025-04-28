import environment from "../../environment";

const groupUrl = "/groups";
const memberUrl = "/members";

export const URLS = {
    registerUser: `${environment.AUTH_API_URL}/users/register`,
    loginUser: `${environment.AUTH_API_URL}/users/login`,
    logoutUser: `${environment.AUTH_API_URL}/user/logout`,
    resetPassword: `${environment.AUTH_API_URL}/users/renew_access`,
    me: `${environment.AUTH_API_URL}/me`,

    groups: `${environment.API_URL}/v1.0${groupUrl}`,
    group: `${environment.API_URL}/v1.0${groupUrl}/:groupId`,
    groupMember: `${environment.API_URL}/v1.0${groupUrl}/:groupId/add/:memberId`,
    groupMemberRemove: `${environment.API_URL}/v1.0${groupUrl}/:groupId/remove/:memberId`,
    groupMemberMultiple: `${environment.API_URL}/v1.0${groupUrl}/:groupId/multiple/add`,
    sendMail: `${environment.API_URL}/v1.0${groupUrl}/:groupId/sendMail`,

    members: `${environment.API_URL}/v1.0${memberUrl}`,
    member: `${environment.API_URL}/v1.0${memberUrl}/:memberId`,
};
