import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (credentials) => {
        const res = await api.post('/auth/login', credentials);
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
        }
        return res.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export const noticeService = {
    getNotices: async (category = '') => {
        const url = category ? `/notices?category=${category}` : '/notices';
        const res = await api.get(url);
        return res.data;
    },
    getArchivedNotices: async () => {
        const res = await api.get('/notices/archive');
        return res.data;
    },
    createNotice: async (data) => {
        const res = await api.post('/notices', data);
        return res.data;
    },
    updateNotice: async (id, data) => {
        const res = await api.put(`/notices/${id}`, data);
        return res.data;
    },
    deleteNotice: async (id) => {
        const res = await api.delete(`/notices/${id}`);
        return res.data;
    }
};

export const categoryService = {
    getCategories: async () => {
        const res = await api.get('/categories');
        return res.data;
    }
};
