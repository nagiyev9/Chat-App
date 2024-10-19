export const closeAccountMessage = (name, surname, code) => {
    return `
        <h1>Hello, ${name} ${surname}!</h1>
        <p>We received a request to close your account.</p>
        <p>If you wish to proceed with closing your account, please confirm by using the confirmation code below:</p>
        <b>Your account closure confirmation code: ${code}</b>
        <p>If you did not request this action, please ignore this email and your account will remain active.</p>
        <p>Best regards, <br>Your Company Team</p>
    `;
};