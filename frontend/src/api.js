import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

export const loginUser = (username, password) =>
    api.post('/api/login/', { username, password }, { withCredentials: true });

export const registerUser = (username, password, email) =>
    api.post('/api/register/', {username, password, email});

export const currentUser = () =>
    api.post('/api/current_user/', {}, { withCredentials: true });

export const logoutUser = () =>
    api.post('/api/logout/', {}, { withCredentials: true });