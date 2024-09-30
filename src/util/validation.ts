
export const validateName = (name: string): boolean => {
    const namePattern = /^(?! )[A-Za-z]+(?: [A-Za-z]+)*$/; 
    return name.trim().length >= 3 && namePattern.test(name.trim());
};

export const validateEmail = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|apple\.com)$/;
    return emailPattern.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
};

export const validatePassword = (password: string): boolean => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    return passwordPattern.test(password);
};
