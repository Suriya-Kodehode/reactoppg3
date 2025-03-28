import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../util/getapi.jsx';
import ErrorDisplay from '../components/ErrorDisplay.jsx';
import LoadingDisplay from '../components/loadingDisplay.jsx';
import EditForm from '../components/EditForm.jsx';
import { getFromLocalStorage, removeFromLocalStorage } from '../util/localStorage.jsx';

import styles from '../CSSModules/profilePage.module.css';

function ProfilePage() {
    const [ profile, setProfile ] = useState(null);
    const [updatedProfile, setUpdatedProfile] = useState({ newUsername: '', newEmail: '' });
    const [ editMode, setEditMode ] = useState(false);
    const [ error, setError ] = useState('');
    const [ saving, setSaving ] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        const token = getFromLocalStorage('jwtToken');
        // console.log("Token from localStorage:", token);
        if(!token) {
            console.warn("No token found, Redirecting to login.");
            navigate('/login');
            return;
        }

        try {
            const response = await api.fetchUser(token);
            // console.log("Fethed profile response:", response);

            if (!response || !response.UserID || !response.UserName || !response.Email) {
                throw new Error("Unexpected server response. Profile data is missing.")
            }
            setProfile(response);
            setUpdatedProfile({ newUsername: response.UserName, newEmail: response.Email });
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(err.error || "Failed to fetch profile. Please try again.");
        }
    }, [navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleEdit = () => {
        setEditMode(true);
        setError('');
    }

    const handleCancelEdit = () => {
        setEditMode(false);
        setUpdatedProfile({ newUsername: profile.UserName, newEmail: profile.Email });
        setError('');
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newEmail') {
            setError(
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
                ? '' 
                : 'Invalid email format'
            );
        }
        setUpdatedProfile((prev) => ({ ...prev, [name]: value }));
    }

    const handleSave = async () => {
        const token = localStorage.getItem("jwtToken");

        if (error) {
            console.error("Validation error:", error);
            return;
        }
        if (
            updatedProfile.newUsername === profile.UserName &&
            updatedProfile.newEmail === profile.Email
        ) {
            setError("No changes detected. Please modify at least one field.");
            return;
        }
        if (!updatedProfile.newUsername.trim() && !updatedProfile.newEmail.trim()) {
            setError("At least one field (username or email) must be provided for update.");
            return;
        }
        if (updatedProfile.newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedProfile.newEmail)) {
            setError("Please enter a valid email address.");
            return;
        }
    
        setSaving(true);
    
        try {
            const payload = {
                newUsername: updatedProfile.newUsername,
                newEmail: updatedProfile.newEmail,
            }
            // console.log("Payload being sent to /api/user/edit:", payload);

            const response = await api.editUser(payload, token);
            // console.log("Profile update response:", response);
    
            if (response && response.message === 'User updated successfully') {
                setProfile({ UserName: updatedProfile.newUsername, Email: updatedProfile.newEmail });
                setEditMode(false);
            } else {
                throw new Error(response.error || "Failed to update profile.");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            if (err.response?.status === 400) {
                setError(err.response.data?.error || "Bad Request: Check your inputs.");
            } else {
                setError(err.message || "Failed to update profile.");
            }
        } finally {
            setSaving(false);
        }
    };
    
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            removeFromLocalStorage('jwtToken')
            console.log("User logged out and token cleared.")
            navigate('/login');
        }
    }

    if (error) {
        return <ErrorDisplay
            error={error}
            navigate={navigate}
            retry={fetchUsers}
            actionText="Retry"
            actionCallback={fetchUsers}
            />;
    }
    if (!profile) {
        return <LoadingDisplay/>
    }

    return (
        <>
            <div className={styles.profilePage}>
                {editMode ? (
                    <EditForm
                    updatedProfile={updatedProfile}
                    profile={profile}
                    handleInputChange={handleInputChange}
                    handleSave={handleSave}
                    handleCancelEdit={handleCancelEdit}
                    saving={saving}
                    />
                ) : (
                    <div className={styles.profileBox}>
                        <h2>Welcome, {profile.UserName || 'User'}!</h2>
                        <p>Email: {profile.Email}</p>
                        <div className={styles.profileButton}>
                            <button onClick={handleEdit}>Edit Profile</button>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProfilePage;