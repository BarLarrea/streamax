import api from "./api.js";
import { API_URLS } from "../config/urls.js";

export const editUser = async (userName, userEmail) => {
    const response = await api.patch(`${API_URLS.USERS.EDIT}`, {
        userName,
        email: userEmail
    });
    return response.data;
};

export const changeUserPassword = async (currentPassword, newPassword) => {
    const redponse = await api.patch(`${API_URLS.USERS.CH_PSSWORD}`, {
        currentPassword,
        newPassword
    });

    console.log({ redponse });
    return redponse.data;
};
