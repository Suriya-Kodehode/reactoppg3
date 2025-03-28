export const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.error(`Error saving to localStorage: ${key}`, error);
    }
};

export const getFromLocalStorage = (key) => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`Error retrieving from localStorage: ${key}`, error);
        return null;
    }
};

export const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from localStorage: ${key}`, error);
    }
};
