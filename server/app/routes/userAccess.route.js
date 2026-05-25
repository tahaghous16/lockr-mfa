import express from "express";

import { jwtAuthMiddleware } from "../middleware/JWTauth.middleware.js";

const router = express.Router();
router.get("/home", jwtAuthMiddleware, (req, res) => {
  res.json({
    message: "Welcome Home",
    user: req.user,
  });
});

export default router;
