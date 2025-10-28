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

    return response.json();
};
