import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { generateToken } from "../middleware/JWTauth.middleware.js";
import { userModel } from "../models/user.model.js";

/**
 * - User Signup Controller
 * - POST /api/auth/signup
 */
const signupController = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists!" });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `MyApp (${email})`,
    });

    // Create user
    const userAdded = await userModel.create({
      username,
      email,
      password,
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false,
    });

    //  Generate QR
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    //  Manual setup key
    const setupKey = secret.base32.match(/.{1,4}/g).join(" ");

    res.status(201).json({
      message: "Scan QR and verify OTP",
      qrCode,
      email: userAdded.email,
      setupKey,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * - User Verify Controller
 * - POST /api/auth/verify-2fa
 */

const verifyTwoFA = async (req, res) => {
  const { email, token } = req.body;

  const user = await userModel.findOne({ email }).select("+twoFactorSecret");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.twoFactorEnabled = true;
  await user.save();

  res.json({ message: "2FA Enabled Successfully" });
};

/**
 * - User login Controller
 * - POST /api/auth/login
 */

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  // If user does not exist or password does not match, return error
  if (!user || !(await user.isCompared(password))) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  if (user.twoFactorEnabled) {
    return res.json({
      message: "Enter OTP",
      requires2FA: true,
    });
  }

  res.json({ message: "Login success (no 2FA)" });
};

/**
 * - User Verify login OTP Controller
 * - POST /api/auth/verify-login-otp
 */
const verifyLoginOTP = async (req, res) => {
  const { email, token } = req.body;

  const user = await userModel.findOne({ email }).select("+twoFactorSecret");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // GENERATE JWT HERE (LOGIN COMPLETED)
  const jwtToken = generateToken(user);

  return res.json({
    message: "Login successful ",
    token: jwtToken,
    user: {
      id: user._id,
      email: user.email,
      username: user.username,
    },
  });
};

export { signupController, verifyTwoFA, loginController, verifyLoginOTP };
