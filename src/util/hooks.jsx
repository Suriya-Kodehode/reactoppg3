import { useState } from "react";
import api from "./getapi.jsx";
import { saveToLocalStorage } from "./localStorage.jsx";

export const handleChange = ( formData, setFormData) => (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
}

export const useUser = () => {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const registeringUser = async (userData) => {
        try {
            setError(null);
            setSuccessMessage(null);
            if (!userData.email || !userData.password) {
                setError("Email or password are required");
                return;
            }
            const data = await api.registerUser(userData);
            console.log("[DEBUG] Full server response for registration:", data);
            if (!data || typeof data !== "object") {
                throw new Error("Unexpected server response. Please try again later.");
            }

            setSuccessMessage(data.message || 'User registered successfully');
            setError(null);
        } catch (err) {
            console.error("[ERROR] Error during user registration:", err);
            setError(err.response?.data?.error || 'An unexpected error occurred');  
            setSuccessMessage(null);
        }
    };
    return { error, successMessage, registeringUser };
};

export const useLogin = () => {
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const logInUser = async ({ identifier, password }) => {
        try {
            setError(null);
            setSuccessMessage(null);

            if (!identifier || !password) {
                setError("Username/email and password are required.");
                return;
            }

            const response = await api.loginUser({ identifier, password });
            console.log("[DEBUG] Server response for login:", response);

            const { jwtToken, message } = response;
            if (!jwtToken || typeof jwtToken !== "string" || jwtToken.trim() === "") {
                console.error("[ERROR] Invalid or missing jwtToken in response:", response);
                throw new Error("Login failed: Missing or invalid token.");
            }

            saveToLocalStorage('jwtToken', jwtToken);
            setSuccessMessage(message || 'Login successful');
            setError(null);
        } catch (err) {
            console.error("[ERROR] Login failed:", err.message || err.response?.data);
            setError(err.message || 'An unexpected error occurred');
            setSuccessMessage(null);   
        }
    };
    return { error, successMessage, logInUser };
}