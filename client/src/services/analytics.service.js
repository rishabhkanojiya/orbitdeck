import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const AnalyticsService = {
    getStats() {
        return ApiService.get(URLS.analyticsStats);
    },

    getRecentEvents() {
        return ApiService.get(URLS.analyticsRecent);
    },

    getErrorEvents() {
        return ApiService.get(URLS.analyticsErrors);
    },

    getEventTimeline(formData) {
        const axiosOptions = { params: formData };
        return ApiService.get(URLS.analyticsTimeline, axiosOptions);
    },

    getTopComponents() {
        return ApiService.get(URLS.analyticsComponentUsage);
    },
};
