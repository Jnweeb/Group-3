export const generateInitialPassword = (name, studentNumber) => {
    const firstThreeLetters = name
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 3)
        .toUpperCase();

    const digits = studentNumber.replace(/\D/g, "");
    const lastFourDigits = digits.slice(-4);

    return `${firstThreeLetters}${lastFourDigits}`;
};