import axios from "axios";

axios.defaults.withCredentials = true;

const ApiService = {};

ApiService.get = (url, options = {}) => {
    return axios.get(url, {
        params: options.params,
        headers: options.headers,
    });
};

ApiService.post = (url, options = {}) => {
    return axios.post(url, options.data, {
        headers: options.headers,
        params: options.params,
    });
};

ApiService.put = (url, options) => {
    return axios.put(url, options.data, {
        headers: options.headers,
        params: options.params,
    });
};

ApiService.patch = (url, options = {}) => {
    return axios.patch(url, options.data, {
        headers: options.headers,
        params: options.params,
    });
};

ApiService.delete = (url, options = {}) => {
    return axios.delete(url, {
        data: options.data,
        headers: options.headers,
        params: options.params,
    });
};

ApiService.axios = (options) => {
    return axios(options);
};

axios.interceptors.response.use((response) => {
    return response;
});

export default ApiService;
