const { sendEmail } = require("./sendEmail");

require("dotenv").config();

const {BASE_URL} = process.env;

const sendVerifyingEmail = async ({email, verificationToken}) => {
    const verifyEmail = {
        to: email,
        subject: "Email verification",
        html: `<a target = "_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}">
            Verify email</a>`,
    };

    await sendEmail(verifyEmail);
}

module.exports = sendVerifyingEmail;
