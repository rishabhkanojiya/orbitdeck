import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const AnalyticsService = {
    getStats(formData) {
        const axiosOptions = { params: formData };
        return ApiService.get(URLS.analyticsStats, axiosOptions);
    },

    getRecentEvents(formData) {
        const axiosOptions = { params: formData };
        return ApiService.get(URLS.analyticsRecent, axiosOptions);
    },

    getErrorEvents(formData) {
        const axiosOptions = { params: formData };
        return ApiService.get(URLS.analyticsErrors, axiosOptions);
    },

    getEventTimeline(formData) {
        const axiosOptions = { params: formData };
        return ApiService.get(URLS.analyticsTimeline, axiosOptions);
    },

    getTopComponents(formData) {
        const axiosOptions = { params: formData };
        return ApiService.get(URLS.analyticsComponentUsage, axiosOptions);
    },
};
