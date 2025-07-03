const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
//const {generateVerificationCode} = require('./generateTokens')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});


//Email Templates
const welcomeEmailTemplate = (email, name) => {
    return `
        <h1>Welcome to Our Platform, ${name}!</h1>
        <p>Thank you for registering on our platform! We're excited to have you onboard and look forward to helping you attend & create memorable events.</p>`;
};

const otpMailTemplate = (otp) => {

    return `
    <h1>Email Verification</h1>
    <p>Your OTP for email verification is: <strong>${otp}</strong></p>
    <p>Please enter this OTP to verify your email address.</p>
    `
}

const ResetMailTemplate = (resetUrl) => {
    return `
      <h1>Reset password</h1>
    <p>Your URL for update password is: <strong>${resetUrl}</strong></p>
    <p>Please click on the above link to reset your password.</p>
    `
}

const resetSuccessMailTemplate = (username) => {
    return `
      <h1>Password Updated Successfully !</h1>
    <p>Your password for account <strong>${username}</strong> updated successfully. </p>
    `
}

const eventCreatedMailTemplate = (username, title) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4CAF50;">Hello, ${username}!</h1>
            <p>We are thrilled to inform you that your event, <strong>${title}</strong>, has been successfully created.</p>
            <p>Here's what you can do next:</p>
            <ul style="margin: 10px 0; padding: 0 20px; color: #555;">
                <li>Add more details to make your event stand out.</li>
                <li>Monitor event insights and track its performance.</li>
                <li>Engage with attendees and manage registrations seamlessly.</li>
            </ul>
            <p>Thank you for choosing our platform to host your event. We're excited to see it thrive!</p>
            <p style="margin-top: 20px; font-size: 0.9em; color: #777;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p style="font-weight: bold; margin-top: 30px;">Best regards,<br>Your Event Management Team</p>
        </div>
    `;
};

const eventregistratioMailTemplate = (username, event) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #4CAF50;">Hello, ${username}!</h1>
            <p>We are delighted to confirm your registration for the event <strong>${event.title}</strong>.</p>
            <p>Here are the event details:</p>
            <table style="border-collapse: collapse; margin: 20px 0; width: 100%; font-size: 0.95em; color: #555;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Event Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${event.title}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Host:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${event.host.username}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Location:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${event.location}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${event.startDate} - ${event.endDate}</td>
                </tr>
            </table>
            <p>We are excited to have you join us. Be sure to mark your calendar and prepare for an amazing experience!</p>
            <p style="margin-top: 20px; font-size: 0.9em; color: #777;">If you have any questions or need further information, please don't hesitate to contact us.</p>
            <p style="font-weight: bold; margin-top: 30px;">Best regards,<br>Your Event Management Team</p>
        </div>
    `;
};


const cancelEventMailTemplate = (event) => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #D9534F;">We're Sorry: Event Cancelled</h1>
        <p>Dear Attendee,</p>
        <p>We regret to inform you that the following event has been <strong>cancelled</strong>:</p>
        <h2 style="color: #5bc0de;">${event.title}</h2>
        <p><strong>Date:</strong> ${event.startDate}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>We apologize for any inconvenience this may cause and appreciate your understanding.</p>
        <p>If you have any questions or need further assistance, feel free to reach out to us at <a href="mailto:support@example.com">support@example.com</a>.</p>
        <p>Thank you for your time, and we hope to see you at a future event!</p>
        <p>Best regards,<br> The [Your Organization] Team</p>
      </div>
    `;
};

const eventDetailsUpdatedMailTemplate = (event) => {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">Event Update Notification</h2>
            <p>Dear Attendee,</p>
            <p>We would like to inform you that the details for the event "<strong>${event.title}</strong>" have been updated. Please find the revised details below:</p>
            <ul>
                <li><strong>Date:</strong> ${event.startDate}</li>
                <li><strong>Time:</strong> ${event.time}</li>
                <li><strong>Location:</strong> ${event.location}</li>
                <li><strong>Description:</strong> ${event.description}</li>
            </ul>
            <p>We apologize for any inconvenience caused by this change and appreciate your understanding. We look forward to your participation in the event.</p>
            <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:${event.contactEmail}">${event.contactEmail}</a>.</p>
            <p>Best regards,<br>
            <strong>The ${event.host} Team</strong></p>
        </div>
    `;
};





const sendWelcomeEmail = async (email, name) => {
    const emailContent = welcomeEmailTemplate(email, name);
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`, // sender email
            to: email, // recipient email
            subject: "Welcome to [Event Management System Name]!", // subject
            html: emailContent, // HTML email content
        });
        console.log("Welcome email sent successfully. Message ID: %s", info.messageId);
    } catch (err) {
        console.error("Error in sending welcome email:", err.message || err);
    }
};

const sendOTP = async (email, OTP) => {

    const emailContent = otpMailTemplate(OTP)
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`, // sender email
            to: email, // recipient email
            subject: "OTP Verification !", // subject
            html: emailContent, // HTML email content
        });
        console.log("OTP sent successfully. Message ID: %s", info.messageId);
    } catch (err) {
        console.error("Error in sending OTP:", err.message || err);
    }

}



const sendResetPwdEmail = async (email, resetUrl) => {

    const emailContent = ResetMailTemplate(resetUrl)
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`, // sender email
            to: email, // recipient email
            subject: "OTP Verification !", // subject
            html: emailContent, // HTML email content
        });
        console.log("Reset URl sent successfully. Message ID: %s", info.messageId);
    } catch (err) {
        console.error("Error in sending Reset Url:", err.message || err);
    }

}

const sendResetSuccessEmail = async (email, username) => {
    const emailContent = resetSuccessMailTemplate(username)
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`, // sender email
            to: email, // recipient email
            subject: "Password reset successfully !", // subject
            html: emailContent, // HTML email content
        });
        console.log("Email sent successfully", info.messageId);
    } catch (err) {
        console.error("Error in sending reset success mail:", err.message || err);
    }
}

const sendEventCreatedEmail = async (user, event) => {
    const emailContent = eventCreatedMailTemplate(user.username, event.title)
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`,
            to: user.email,
            subject: "Event Created Successfully !",
            html: emailContent,
        })
        console.log("Email sent successfully", info.messageId);
    } catch (err) {
        console.error("Error in sending reset success mail:", err.message || err);
    }
}

const sendeventRegistrationEmail = async (user, event) => {
    const emailContent = eventregistratioMailTemplate(user.username, event)
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`,
            to: user.email,
            subject: `You're All Set! Registration for ${event.title} Complete `,
            html: emailContent,
        })
        console.log("Email sent successfully", info.messageId);
    } catch (err) {
        console.error("Error in sending event registration success mail:", err.message || err);
    }
}

const sendEventCancellationEmail = async (event,registrations) => {
    try {
        registrations.forEach(registrations => {
            const emailContent = cancelEventMailTemplate(event);

            sendEmail({
                from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`,
                to: registrations.email,
                subject: `Event Cancelled: ${event.title}`,
                html: emailContent
            });
        });

    } catch (err) {
        console.error("Error in sending event cancellation mail:", err.message || err);
    }

};

const sendEventDetailsUpdateEmail = async(event, registrations)=>{
    try {
        registrations.forEach(registrations => {
            const emailContent = cancelEventMailTemplate(event);

            sendEmail({
                from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`,
                to: registrations.email,
                subject: `Event Cancelled: ${event.title}`,
                html: emailContent
            });
        });

    } catch (err) {
        console.error("Error in sending event cancellation mail:", err.message || err);
    }
}





module.exports = {
    sendWelcomeEmail,
    sendOTP,
    sendResetPwdEmail,
    sendResetSuccessEmail,
    sendEventCreatedEmail,
    sendeventRegistrationEmail,
    sendEventCancellationEmail,
    sendEventDetailsUpdateEmail

}; 
