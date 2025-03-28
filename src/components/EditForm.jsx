
import styles from '../CSSModules/form.module.css';

const EditForm = ({ updatedProfile, profile, handleInputChange, handleSave, handleCancelEdit, saving}) => {
    return (
    <div className={styles.editct}>
        <div>
            <label htmlFor='newUsername'>Username:</label>
                    <input
                    id='newUsername'
                    type='text'
                    name='newUsername'
                    value={updatedProfile.newUsername}
                    onChange={handleInputChange}
                    placeholder='Enter new username'
                    />
        </div>
        <div>
            <label htmlFor='newEmail'>Email:</label>
                    <input
                    id='newEmail'
                    type='email'
                    name='newEmail'
                    value={updatedProfile.newEmail}
                    onChange={handleInputChange}
                    placeholder='Enter new email'
                    />
        </div>   
        <div className={styles.editButton}>
            <button 
            onClick={handleSave} 
            disabled={
                saving || 
                (!updatedProfile.newUsername.trim() && !updatedProfile.newEmail.trim()) ||
                (updatedProfile.newUsername === profile.UserName && updatedProfile.newEmail === profile.Email)
            }>
                {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancelEdit}>
                Cancel
            </button>
        </div>
    </div>
    )
}

export default EditForm;