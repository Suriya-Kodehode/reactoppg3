import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser, handleChange as hChange } from '../util/hooks';
import styles from '../CSSModules/registerPage.module.css';

import FormField from '../components/FormField';

function RegisterPage() {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { error, successMessage, registeringUser } = useUser();
    const navigate = useNavigate();

    const handleChange = hChange(formData, setFormData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            await registeringUser({
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
            });
            console.log("Successfully signup");
            setTimeout(() => navigate("/login"), 1000)
        } catch (err) {
            console.error("Registration failed:", err)
        }
    };

    return (
        <>
            <div className={styles.registerPage}>
                <h2>User Register</h2>
                {error && <p className={styles.error} role='alert'>{error}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}
                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <FormField
                    id="username"
                    label="Username"
                    name="userName"
                    type="text"
                    value={formData.userName}
                    autocomplete="username"
                    placeholder="Enter your username"
                    ariaLabel="Username"
                    onChange={handleChange}
                    />
                    <FormField
                    id="email"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    autocomplete="email"
                    placeholder="Enter your email"
                    ariaLabel="Email"
                    onChange={handleChange}
                    required
                    />
                    <FormField
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    autocomplete="new-password"
                    placeholder="Enter your password"
                    ariaLabel="Password"
                    onChange={handleChange}
                    required
                    />
                    <FormField
                    id="confirmPassword"
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    autocomplete="new-password"
                    placeholder="Confirm your password"
                    ariaLabel="Confirm Password"
                    onChange={handleChange}
                    required
                    />
                    <div>
                        <button type="submit">Register</button>
                    </div>
                </form>
                <div className={styles.loginLink}>
                    <p>Already have an account?</p> 
                    <Link to="/login">Log in here</Link>
                </div>
            </div>
        </>
    )
}
export default RegisterPage;