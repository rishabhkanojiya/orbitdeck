import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const AuthService = {
    register(formData) {
        let axiosOptions = { data: formData };
        return ApiService.post(URLS.registerUser, axiosOptions);
    },

    login(formData) {
        let axiosOptions = { data: formData };
        return ApiService.post(URLS.loginUser, axiosOptions);
    },

    forgotPassword(formData) {
        let axiosOptions = { data: formData };
        return ApiService.post(URLS.forgotPassword, axiosOptions);
    },

    resetPassword(formData) {
        let axiosOptions = { data: formData };
        return ApiService.post(URLS.resetPassword, axiosOptions);
    },

    logout() {
        let axiosOptions = {};
        return ApiService.post(URLS.logoutUser, axiosOptions);
    },
};
