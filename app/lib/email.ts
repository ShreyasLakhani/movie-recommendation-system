import nodemailer from 'nodemailer';

// Track failed attempts to prevent lockouts
let failedAttempts = 0;
let lastAttemptTime = 0;
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Validate SMTP configuration
function isEmailConfigured() {
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'];
  return requiredVars.every(varName => !!process.env[varName]);
}

// Create transporter only if configuration is valid
const createTransporter = () => {
  if (!isEmailConfigured()) {
    console.warn('Email service not properly configured. Check your environment variables.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

let transporter = createTransporter();

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  // Check if we're in lockout period
  const now = Date.now();
  if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
    const timeElapsed = now - lastAttemptTime;
    if (timeElapsed < LOCKOUT_DURATION) {
      const minutesLeft = Math.ceil((LOCKOUT_DURATION - timeElapsed) / 60000);
      throw new Error(`Email service temporarily disabled. Please try again in ${minutesLeft} minutes.`);
    } else {
      // Reset after lockout period
      failedAttempts = 0;
    }
  }

  // Validate configuration
  if (!isEmailConfigured()) {
    throw new Error('Email service not configured. Please check your environment variables.');
  }

  // Ensure transporter exists
  if (!transporter) {
    transporter = createTransporter();
    if (!transporter) {
      throw new Error('Failed to initialize email service.');
    }
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    // Reset failed attempts on success
    failedAttempts = 0;
  } catch (error) {
    // Track failed attempts
    failedAttempts++;
    lastAttemptTime = now;
    
    // If we hit max failures, recreate transporter on next attempt
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      transporter = null;
    }
    
    throw error;
  }
} 