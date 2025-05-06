import express from "express";
import {
  register,
  login,
  getCurrentUser,
  updateUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/current", getCurrentUser);
router.put("/update", updateUser);

export default router;
