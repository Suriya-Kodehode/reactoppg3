import axios from 'axios';
import { saveToLocalStorage } from './localStorage.jsx';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    timeout: 10000,
});

const endpoints = {
    registerUser: '/user/create',
    loginUser: '/user/login',
    fetchAllUsers: '/user',
    editUser: '/user/edit',
    validateToken: '/validate-token',
    fetchUser: '/user/profile',
}

const validateTokenInput = (token) => {
    if (!token) {
        console.warn("Missing token.");
        throw new Error("Authentication token is required.");
    }
    if (typeof token !== "string") {
        console.warn("Invalid token format.");
        throw new Error("Authentication token must be a string.");
    }
};

const logError = (action, error) => {
    const timestamp = new Date().toISOString();
    const statusCode = error.response?.status || "Unknown";
    const endpoint = error.config?.url || "Unknown endpoint";
    const logLevel = error.response ? "ERROR" : "WARN";
    console.error(
        `[${timestamp}] [${logLevel}] ${action} at ${endpoint} (Status: ${statusCode}):`, 
        error.response?.data || error.message
    );
}
const formatError = (action, error) => {
    const actionErrors = {
        registerUser: "Failed to register user.",
        loginUser: "Failed to log in user.",
        fetchUser: "Failed to fetch user profile.",
        editUser: "Failed to update user profile.",
        validateToken: "Failed to validate token.",
        fetchAllUsers: "Failed to fetch users.",
    }
    const defaultMessage = actionErrors[action] || "An unexpected error occurred.";
    const endpoint = error.config?.url || "Unknown endpoint";
    return `Error with action: ${defaultMessage} at ${endpoint}`;
};

const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Math.floor(Date.now() / 1000);
    } catch (err) {
        console.warn("Unable to decode token:", err.message);
        return true;
    }
}

const GetAPI = {
    registerUser: async (userData) => {
        try {
            const response = await axiosInstance.post(endpoints.registerUser, userData);
            console.log("[DEBUG] Full API Response:", response.data)
            return response.data;
        } catch (error) {
            logError("registering user", error);
            throw formatError("registerUser", error)
        }
    },

    loginUser: async ({ identifier, password }) => {
        try {
            const response = await axiosInstance.post(endpoints.loginUser, { identifier, password });
            console.log("[DEBUG] Full API Response:", response.data);
            const { jwtToken, message } = response.data;
            if (!jwtToken || typeof jwtToken !== "string") {
                throw new Error("Server did not return a valid token. Login failed.");
            }
            saveToLocalStorage('jwtToken', jwtToken);
            return { success: true, jwtToken, message: message || "Login successfull" };
        } catch (error) {
            logError("logging in user", error);
            throw new Error(formatError("loginUser", error));   
        }
    },

    fetchAllUsers: async () => {
        try {
            const response = await axiosInstance.get(endpoints.fetchAllUsers);
            if (!response.data || !Array.isArray(response.data)) {
                throw new Error("Unexpected response structure from server.");
            }
            return response.data;
        } catch (error) {
            logError("fetching users", error);
            throw formatError("fetchAllUser", error);
        }
    },

    editUser: async (editData, token) => {
        validateTokenInput(token);
        if (isTokenExpired(token)) {
            throw new Error("Token has expired. Please log in again.");
        }
        try {
            const response = await axiosInstance.put(endpoints.editUser, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            logError("editing user profile", error);
            throw new Error(formatError("editUser", error));
        }
    },

    validateToken: async (token) => {
        validateTokenInput(token);
        if (isTokenExpired(token)) {
            throw new Error("Token has expired. Please log in again.")
        }
        try {
            const response = await axiosInstance.post(endpoints.validateToken, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            logError("validating token", error);
            throw new Error(formatError("validateToken", error));
        }
    },

    fetchUser: async (token) => {
        validateTokenInput(token);
        try {
            const response = await axiosInstance.get(endpoints.fetchUser, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!response.data?.profile) {
                throw new Error("Unexpected server response. Please try again later.");
            }
            return response.data.profile;
        } catch (error) {
            logError("fetching user profile", error)
            throw new Error(formatError("fetchUser", error));
        }
    }
}

export default GetAPI;