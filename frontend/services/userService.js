import api from "./api.js";
import { API_URLS } from "../config/urls.js";

export const editUser = async (userName, userEmail) => {
    const response = await api.patch(`${API_URLS.USERS.UPDATE}`, {
        userName,
        email: userEmail
    });
    return response.data;
};

export const changeUserPassword = async (currentPassword, newPassword) => {
    const redponse = await api.patch(`${API_URLS.USERS.CHANGE_PASSWORD}`, {
        currentPassword,
        newPassword
    });

    return redponse.data;
};

export const deleteUserAccount = async () => {
    const response = await api.delete(`${API_URLS.USERS.DELETE}`);
    return response.data;
};
