import { API_URLS } from "../config/urls.js";

export const loginUser = async (userName, password) => {
    const response = await axios.post(
        `${API_URLS.BASE}${API_URLS.AUTH.LOGIN}`,
        {
            userName,
            password
        },
        { withCredentials: true }
    );

    return response.data;
};

export const registerUser = async (userName, email, password, adminCode) => {
    const response = await axios.post(
        `${API_URLS.BASE}${API_URLS.AUTH.REGISTER}`,
        {
            userName,
            email,
            password,
            adminCode
        }
    );

    return response.data;
};
