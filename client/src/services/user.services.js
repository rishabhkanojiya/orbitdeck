import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const UserService = {
    getUser(formData) {
        let axiosOptions = { data: formData };
        return ApiService.get(URLS.me, axiosOptions);
    },

    updateUser(formData) {
        let axiosOptions = { data: formData };
        return ApiService.patch(URLS.me, axiosOptions);
    },

    deleteUser(formData) {
        let axiosOptions = { data: formData };
        return ApiService.delete(URLS.me, axiosOptions);
    },
};
