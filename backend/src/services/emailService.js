import nodemailer from 'nodemailer'
import { env } from '../config/environment.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
})

const sendPasswordResetEmail = async (toEmail, token) => {
  const mailOptions = {
    from: `"FEMS Support" <${env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'FEMS - Password Reset Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #1E2B58;">Password Reset Request</h2>
        <p>You requested a password reset for your FEMS account.</p>
        <p>Please use the following 6-digit verification code to reset your password:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; margin: 0; color: #1E2B58;">${token}</h1>
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you did not request a password reset, please ignore this email or contact support.</p>
        <br/>
        <p>Regards,<br/>FEMS Support Team</p>
      </div>
    `,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent: ' + info.response)
    return true
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return false
  }
}

export const emailService = {
  sendPasswordResetEmail,
}
