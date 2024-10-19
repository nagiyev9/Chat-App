export const isNotExist = () => {
    return `
    <p>Hi,</p>
    <br>
    <p>You tried resetting your password for Chat App, but you don't have an account at this email yet. If you'd like to signup using this email, please click below to Sign up.</p>
    <br>
    <a href="signUp-Link" style="color: #fff; background-color: #2208CC; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Sign Up</a>
    <br>
    <p>Thanks,</p>
    <b>The Chat Team</b>
    `
};

export const resetPasswordMessage = url => {
    return `
    <p>Hi,</p>
    <br>
    <p>You tried resetting your password for Chat App, but you don't have an account at this email yet. If you'd like to signup using this email, please click below to Sign up.</p>
    <br>
    <a href="${url}" style="color: #fff; background-color: #2208CC; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
    <br>
    <p>Thanks,</p>
    <b>The Chat Team</b>
    `
};