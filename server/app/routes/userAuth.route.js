import express from "express";
import {
  signupController,
  verifyTwoFA,
  loginController,
  verifyLoginOTP,
} from "../controllers/userAuth.controller.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/verify-2fa", verifyTwoFA);
router.post("/login", loginController);
router.post("/verify-login-otp", verifyLoginOTP);

export default router;
