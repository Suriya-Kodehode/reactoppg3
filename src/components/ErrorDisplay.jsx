import styles from '../CSSModules/offScreen.module.css';

const ErrorDisplay = ({ error, navigate, retry, actionText, actionCallback  }) => {
    return (
    <div className={styles.error}>
        <div className={styles.errorText}>
            <h2>Error</h2>
            <p>{error}</p>
        </div>
        <div className={styles.errorButton}>
            {actionText && actionCallback && 
            <button onClick={actionCallback}>{actionText}</button>}
            <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
    </div>
    )
}

export default ErrorDisplay;