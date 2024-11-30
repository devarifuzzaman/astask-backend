const UserModel = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
const OTPModel = require('../models/OTPModel');
const SendEmailUtility = require('../utility/SendEmailUtility');

// User Registration
exports.registration = (req, res) => {
  let reqBody = req.body;
  
  // Validate incoming data (can be expanded)
  if (!reqBody.email || !reqBody.password) {
    return res.status(400).json({ status: "fail", message: "Email and password are required." });
  }

  // Create new user in the database
  UserModel.create(reqBody, (err, data) => {
    if (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    } else {
      return res.status(201).json({ status: "success", data: data });
    }
  });
}

// User Login
exports.login = (req, res) => {
  let reqBody = req.body;

  // Validate request body
  if (!reqBody.email || !reqBody.password) {
    return res.status(400).json({ status: "fail", message: "Email and password are required." });
  }

  // Find user by email
  UserModel.findOne({ email: reqBody.email }, (err, user) => {
    if (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    }
    
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Password matching (Assuming hashed password is used)
    user.comparePassword(reqBody.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ status: "fail", message: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ status: "fail", message: "Invalid credentials" });
      }

      // Create JWT token
      const payload = {
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };

      const token = jwt.sign(payload, 'your_secret_key', { expiresIn: '1h' });

      return res.status(200).json({
        status: "success",
        message: "Login successful",
        token: token,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          mobile: user.mobile,
          photo: user.photo
        }
      });
    });
  });
};

// OTP-based Authentication
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ status: "fail", message: "Email and OTP are required." });
  }

  // Find OTP record for the email
  OTPModel.findOne({ email: email, otp: otp }, (err, otpRecord) => {
    if (err) {
      return res.status(500).json({ status: "fail", message: err.message });
    }

    if (!otpRecord) {
      return res.status(400).json({ status: "fail", message: "Invalid OTP" });
    }

    // OTP is valid, proceed with further actions (e.g., login or registration)
    return res.status(200).json({ status: "success", message: "OTP verified successfully" });
  });
};

// Example Utility for Sending Emails (Use for OTP, registration confirmation, etc.)
exports.sendWelcomeEmail = (email, firstName) => {
  const subject = 'Welcome to Our Platform';
  const message = `Hello ${firstName},\n\nThank you for registering with us. We're excited to have you!`;
  
  SendEmailUtility.sendEmail(email, subject, message, (err, response) => {
    if (err) {
      console.log("Error sending welcome email:", err);
    } else {
      console.log("Welcome email sent successfully:", response);
    }
  });
};
