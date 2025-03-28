import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useLogin, handleChange as hChange } from "../util/hooks.jsx";
import FormField from "../components/FormField.jsx";

import styles from "../CSSModules/loginPage.module.css";

function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const { error, successMessage, logInUser } = useLogin();
    const [localError, setLocalError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); 

    const handleChange = hChange(formData, setFormData);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLocalError("");
        setLoading(true);
        try {
            await logInUser({
                identifier: formData.identifier,
                password: formData.password,
            });
            setTimeout(() => navigate("/profile"), 1000)
        } catch (err) {
            console.error("Login failed:", err);
            setLocalError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={styles.loginPage}>
                <h2>Login</h2>
                {(localError || error) && (
                    <p className={styles.error} role="alert">
                        {localError || error}
                    </p>
                )}
                {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <FormField
                        id="identifier"
                        label="Username or Email"
                        name="identifier"
                        type="text"
                        value={formData.identifier}
                        placeholder="Enter your username or email"
                        autocomplete={"username"}
                        ariaLabel="Username or Email"
                        onChange={handleChange}
                        required
                    />
                    <FormField
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        autocomplete={"current-password"}
                        ariaLabel="Password"
                        onChange={handleChange}
                        required
                    />
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </div>
                </form>
                <div className={styles.registerLink}>
                    <p>Don't have an account?</p>
                    <Link to="/">Register here</Link>
                </div>
            </div>
        </>
    )

}

export default LoginPage;