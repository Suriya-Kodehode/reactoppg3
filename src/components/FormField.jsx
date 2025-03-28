import styles from '../CSSModules/form.module.css';

function FormField({ id, label, name, type, value, autocomplete, placeholder, ariaLabel, onChange, required = false }) {
    return (
        <div className={styles.registerForm}>
            <label htmlFor={id}>{label}:</label>
            <input 
            type={type}
            id={id} 
            name={name} 
            value={value}
            autoComplete={autocomplete}
            placeholder={placeholder}
            aria-label={ariaLabel}
            onChange={onChange}
            required={required}                      
            />
        </div>
    )
}

export default FormField;