import environment from "../../environment";

const groupUrl = "/groups";
const memberUrl = "/members";

export const URLS = {
    registerUser: `${environment.API_URL}/v1.0/user/register`,
    loginUser: `${environment.API_URL}/v1.0/user/login`,
    logoutUser: `${environment.API_URL}/v1.0/user/logout`,
    forgotPassword: `${environment.API_URL}/v1.0/user/forgot-password`,
    resetPassword: `${environment.API_URL}/v1.0/user/reset-password`,
    me: `${environment.API_URL}/v1.0/user/me`,

    groups: `${environment.API_URL}/v1.0${groupUrl}`,
    group: `${environment.API_URL}/v1.0${groupUrl}/:groupId`,
    groupMember: `${environment.API_URL}/v1.0${groupUrl}/:groupId/add/:memberId`,
    groupMemberRemove: `${environment.API_URL}/v1.0${groupUrl}/:groupId/remove/:memberId`,
    groupMemberMultiple: `${environment.API_URL}/v1.0${groupUrl}/:groupId/multiple/add`,
    sendMail: `${environment.API_URL}/v1.0${groupUrl}/:groupId/sendMail`,

    members: `${environment.API_URL}/v1.0${memberUrl}`,
    member: `${environment.API_URL}/v1.0${memberUrl}/:memberId`,
};
