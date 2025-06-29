// services/emailService.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });
  }

  // Generate secure random token
  generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Send email verification
  async sendVerificationEmail(email, token, username) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: `"Chill Habit Tracker" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Verify Your Email - Chill Habit Tracker',
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 30px 25px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Welcome to Chill Habit Tracker!</h1>
          </div>
          
          <!-- Content -->
          <div style="background: #fafaf9; padding: 30px 25px; border-radius: 0 0 16px 16px; border: 1px solid #e7e5e4;">
            <h2 style="color: #d97706; margin-top: 0; font-size: 20px; font-weight: 600;">Hi ${username}!</h2>
            
            <p style="color: #57534e; font-size: 15px; margin: 16px 0;">Thanks for signing up! We're excited to help you build better habits, one day at a time.</p>
            
            <p style="color: #57534e; font-size: 15px; margin: 16px 0;">Please verify your email address by clicking the button below:</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="${verificationUrl}" 
                 style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);">
                Verify Email Address
              </a>
            </div>
            
            <!-- Alternative link -->
            <div style="background: #f5f5f4; border: 1px solid #d6d3d1; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="font-size: 13px; color: #78716c; margin: 0 0 8px 0;">If the button doesn't work, copy and paste this link:</p>
              <p style="font-size: 12px; color: #d97706; word-break: break-all; margin: 0; font-family: monospace;">${verificationUrl}</p>
            </div>
            
            <!-- Security note -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #92400e;">
                <strong>⏰ Security Note:</strong> This link expires in 24 hours.
              </p>
            </div>
            
            <p style="font-size: 13px; color: #78716c; margin: 20px 0 0 0;">
              If you didn't create an account, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, token, username) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"Chill Habit Tracker" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Reset Your Password - Chill Habit Tracker',
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); padding: 30px 25px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Password Reset Request</h1>
          </div>
          
          <!-- Content -->
          <div style="background: #fafaf9; padding: 30px 25px; border-radius: 0 0 16px 16px; border: 1px solid #e7e5e4;">
            <h2 style="color: #d97706; margin-top: 0; font-size: 20px; font-weight: 600;">Hi ${username}!</h2>
            
            <p style="color: #57534e; font-size: 15px; margin: 16px 0;">We received a request to reset your password for your Chill Habit Tracker account.</p>
            
            <p style="color: #57534e; font-size: 15px; margin: 16px 0;">Click the button below to reset your password:</p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" 
                 style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);">
                Reset Password
              </a>
            </div>
            
            <!-- Alternative link -->
            <div style="background: #f5f5f4; border: 1px solid #d6d3d1; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="font-size: 13px; color: #78716c; margin: 0 0 8px 0;">If the button doesn't work, copy and paste this link:</p>
              <p style="font-size: 12px; color: #d97706; word-break: break-all; margin: 0; font-family: monospace;">${resetUrl}</p>
            </div>
            
            <!-- Security warning -->
            <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #dc2626;">
                <strong>🔒 Security Note:</strong> This link expires in 1 hour.
              </p>
            </div>
            
            <p style="font-size: 13px; color: #78716c; margin: 20px 0 0 0;">
              If you didn't request this, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  // Send password change confirmation
  async sendPasswordChangeConfirmation(email, username) {
    const mailOptions = {
      from: `"Chill Habit Tracker" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Password Changed Successfully - Chill Habit Tracker',
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 25px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Password Changed Successfully</h1>
          </div>
          
          <!-- Content -->
          <div style="background: #fafaf9; padding: 30px 25px; border-radius: 0 0 16px 16px; border: 1px solid #e7e5e4;">
            <h2 style="color: #059669; margin-top: 0; font-size: 20px; font-weight: 600;">Hi ${username}!</h2>
            
            <p style="color: #57534e; font-size: 15px; margin: 16px 0;">Your password has been successfully changed for your Chill Habit Tracker account.</p>
            
            <p style="color: #57534e; font-size: 15px; margin: 16px 0;">If you made this change, no further action is required.</p>
            
            <!-- Security warning -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #92400e;">
                <strong>⚠️ Didn't make this change?</strong> Please contact support or reset your password again.
              </p>
            </div>
            
            <div style="background: #f5f5f4; border: 1px solid #d6d3d1; border-radius: 8px; padding: 12px; margin: 20px 0;">
              <p style="font-size: 13px; color: #78716c; margin: 0;">
                <strong>Changed on:</strong> ${new Date().toLocaleString()}
              </p>
            </div>
            
            <p style="font-size: 12px; color: #a8a29e; margin: 20px 0 0 0; text-align: center;">
              Keep building those healthy habits! 🌟
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password change confirmation sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Error sending password change confirmation:', error);
      // Don't throw error here as it's not critical
      return false;
    }
  }

  // Test email configuration
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
      return true;
    } catch (error) {
      console.error('Email service configuration error:', error);
      return false;
    }
  }
}

export default new EmailService();