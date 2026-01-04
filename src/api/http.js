import axios from 'axios';
import { auth } from '../auth/firebase';
import { getIdToken } from 'firebase/auth';

const http = axios.create({
    baseURL: 'http://localhost:8000', // Adjust this if your backend runs on a different port
    headers: {
        'Content-Type': 'application/json',
    },
});

http.interceptors.request.use(
    async (config) => {
        const user = auth.currentUser;
        if (user) {
            const token = await getIdToken(user);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Global 401 handling - could redirect to login or clear auth
            console.error('Unauthorized access - redirecting to login');
            // window.location.href = '/login'; // Optional: force redirect
        }
        return Promise.reject(error);
    }
);

export default http;
