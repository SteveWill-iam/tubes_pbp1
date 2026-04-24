import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; 
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const OTP_EXPIRY_MS = 10 * 60 * 1000;

// const createTransporter = () =>
//   nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

const createTransporter = () => 
    nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ─── Forgot Password — Step 1: Send OTP via Gmail ────────────────────────────
// OTP is persisted to the database (reset_otp + reset_otp_expires columns)
// so the flow is stateless across multiple backend replicas.
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  try {
    const user = await Admin.findOne({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user) return res.json({ message: 'If an account with that email exists, a code has been sent.' });

    // Generate 6-digit OTP and persist its hash to the user's DB row
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 12);
    await user.update({
      reset_otp: hashedOtp,
      reset_otp_expires: new Date(Date.now() + OTP_EXPIRY_MS),
    });

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"MCDonald" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'MCDonald admin Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #dc2626; color: #fff; border-radius: 12px; overflow: hidden;">
          <div style="background: #FFC72C; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">MCDonald</h1>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #fff; margin-top: 0;">Password Reset Code</h2>
            <p style="color: #aaa;">Hi ${user.nama}, use the code below to reset your password. It expires in 10 minutes.</p>
            <div style="background: #1a1a1a; border: 2px solid #e50914; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #e50914;">${otp}</span>
            </div>
            <p style="color: #666; font-size: 13px;">If you didn't request this, you can safely ignore this email.</p>
          </div>
        </div>
      `,
    });

    return res.json({ message: 'If an account with that email exists, a code has been sent.' });
  } catch (err) {
    console.error('[Forgot Password]', err);
    return res.status(500).json({ error: 'Failed to send reset email. Please try again.' });
  }
};

// ─── Forgot Password — Step 2: Verify OTP ────────────────────────────────────
// Reads OTP from the database instead of an in-memory Map.
export const verifyOtp = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'email and otp are required' });

  try {
    const user = await Admin.findOne({ where: { email } });
    if (!user || !user.reset_otp) {
      return res.status(400).json({ error: 'No OTP requested for this email.' });
    }
    if (new Date() > user.reset_otp_expires!) {
      // Clear the expired OTP
      await user.update({ reset_otp: null, reset_otp_expires: null });
      return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
    }
    const isMatch = await bcrypt.compare(otp.toString(), user.reset_otp);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect OTP code.' });
    }

    // OTP valid — clear it from DB and issue a short-lived reset token
    await user.update({ reset_otp: null, reset_otp_expires: null });
    const resetToken = jwt.sign({ email, purpose: 'password_reset' }, process.env.JWT_SECRET as string, { expiresIn: '10m' });

    return res.json({ message: 'OTP verified.', reset_token: resetToken });
  } catch (err) {
    console.error('[Verify OTP]', err);
    return res.status(500).json({ error: 'OTP verification failed.' });
  }
};

// ─── Forgot Password — Step 3: Reset Password with token ─────────────────────
export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { reset_token, newPassword } = req.body;
  if (!reset_token || !newPassword) return res.status(400).json({ error: 'reset_token and newPassword are required' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

  try {
    let payload: any;
    try {
      payload = jwt.verify(reset_token, process.env.JWT_SECRET as string);
    } catch {
      return res.status(400).json({ error: 'Reset token is invalid or expired. Please start over.' });
    }

    if (payload.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid token purpose.' });
    }

    const user = await Admin.findOne({ where: { email: payload.email as string } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.password_hash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

