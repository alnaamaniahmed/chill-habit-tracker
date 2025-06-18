import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import { OAuth2Client } from "google-auth-library";
import emailService from "../services/emailService.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Rate limiting for sensitive operations
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: { message: 'Too many password reset requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to generate JWT
const generateToken = (userId) => {
  const payload = { user: { id: userId } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

// Register route with email verification
router.post("/register", authLimiter, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate email verification token
    const verificationToken = emailService.generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    user = new User({
      username,
      email,
      password: passwordHash,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      isEmailVerified: false
    });

    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(email, verificationToken, username);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      message: "Registration successful! Please check your email to verify your account.",
      emailVerificationSent: true
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route with account locking
router.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: "Account temporarily locked due to too many failed login attempts. Please try again later." 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Generate JWT token
    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Google OAuth route (users auto-verified)
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        username: name,
        email,
        googleId,
        profilePicture: picture,
        isEmailVerified: true, // Google users are automatically verified
      });
      await user.save();
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && (!user.profilePicture || user.profilePicture !== picture)) {
        user.profilePicture = picture;
      }
      // Verify email for Google users
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
      }
      await user.save();
    }

    const token = generateToken(user.id);
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error("Google OAuth Error:", err);
    res.status(400).json({ message: "Google authentication failed" });
  }
});

// Verify email route
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired verification token" 
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ 
      message: "Email verified successfully!",
      success: true 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Resend verification email
router.post("/resend-verification", authLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = emailService.generateToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken, user.username);

    res.json({ 
      message: "Verification email sent successfully!",
      success: true 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to send verification email" });
  }
});

// Forgot password route
router.post("/forgot-password", passwordResetLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether user exists or not
      return res.json({ 
        message: "If an account with that email exists, we've sent a password reset link.",
        success: true 
      });
    }

    // Generate password reset token
    const resetToken = emailService.generateToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(email, resetToken, user.username);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    res.json({ 
      message: "If an account with that email exists, we've sent a password reset link.",
      success: true 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Reset password route
router.post("/reset-password", authLimiter, async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: "Invalid or expired reset token" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Update user
    user.password = passwordHash;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    
    // Reset any login attempts/locks
    user.loginAttempts = undefined;
    user.lockUntil = undefined;
    
    await user.save();

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(user.email, user.username);
    } catch (emailError) {
      console.error('Failed to send password change confirmation:', emailError);
      // Continue even if confirmation email fails
    }

    res.json({ 
      message: "Password reset successfully!",
      success: true 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Change password route (for logged-in users)
router.post("/change-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check current password (skip for Google users without password)
    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.password = passwordHash;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(user.email, user.username);
    } catch (emailError) {
      console.error('Failed to send password change confirmation:', emailError);
    }

    res.json({ 
      message: "Password changed successfully!",
      success: true 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get current user route
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -emailVerificationToken -passwordResetToken");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;