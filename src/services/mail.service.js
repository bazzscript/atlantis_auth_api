const sendgridMail = require('@sendgrid/mail');

const mail = {};

mail.sendPasswordResetMail = async ({
    recipient,
    token
}) => {
    // Set Sendgrid Api Key
    await sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: String(recipient), 
        from: process.env.SENDGRID_VERIFIED_EMAIL, 
        subject: 'Password Reset Email',
        text: `This is your password Reset Token : ${token}`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }


    try {
        const data = await sendgridMail.send(msg);
        console.log("Email Sending Service", data);
    } catch (error) {
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
    }
}
module.exports = mail;