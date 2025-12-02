import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

let loaderCallbacks = null;

export const setLoaderCallbacks = (showLoader, hideLoader) => {
    loaderCallbacks = { showLoader, hideLoader };
};

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        // Don't set Content-Type for FormData (let browser set it with boundary)
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        // Show loader for non-GET requests
        if (config.method !== 'get' && loaderCallbacks) {
            loaderCallbacks.showLoader('Processing...');
        }
        return config;
    },
    error => {
        if (loaderCallbacks) loaderCallbacks.hideLoader();
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        if (loaderCallbacks) loaderCallbacks.hideLoader();
        return response;
    },
    error => {
        if (loaderCallbacks) loaderCallbacks.hideLoader();
        return Promise.reject(error);
    }
);

export default api;
