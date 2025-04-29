import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const DeploymentService = {
    createDeployment(formData) {
        const axiosOptions = { data: formData };

        return ApiService.post(URLS.deploymentAdd, axiosOptions);
    },

    getMyDeployments() {
        const axiosOptions = {};

        return ApiService.get(URLS.deployments, axiosOptions);
    },

    getDeploymentById(formData) {
        const { deploymentId } = formData;
        const axiosOptions = {};

        return ApiService.get(
            URLS.deployment.replace(":deploymentId", deploymentId),
            axiosOptions,
        );
    },

    uninstallDeployment(formData) {
        const { deploymentId } = formData;
        const axiosOptions = {};

        return ApiService.post(
            URLS.deployment.replace(":deploymentId", deploymentId),
            axiosOptions,
        );
    },
};
