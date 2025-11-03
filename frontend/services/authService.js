import { API_URLS } from "../config/urls.js";
import api from "./api.js";

export const loginUser = async (userName, password) => {
    const response = await api.post(`${API_URLS.AUTH.LOGIN}`, {
        userName,
        password
    });

    return response.data;
};

export const registerUser = async (userName, email, password, adminCode) => {
    const response = await api.post(`${API_URLS.AUTH.REGISTER}`, {
        userName,
        email,
        password,
        adminCode
    });

    return response.data;
};

export const logoutUser = async () => {
    const response = await api.post(`${API_URLS.AUTH.LOGOUT}`);
    return response.data;
};
