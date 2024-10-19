export const signupMessage = (name, surname, code) => {
    return `
        <h1>Welcome to Our Platform, ${name} ${surname}!</h1>
        <p>Thank you for signing up! Please confirm your account by clicking the link below:</p>
        <b>Your confirmation code: ${code}</b>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards, <br>Your Company Team</p>
    `;
};