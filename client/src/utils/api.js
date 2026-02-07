import axios from 'axios';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
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
        
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
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
