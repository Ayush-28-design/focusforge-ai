import express from "express";

import { registerUser, loginUser } from "../controllers/auth.controller";

import { authenticateUser, AuthRequest } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", authenticateUser, (req: AuthRequest, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});

export default router;
