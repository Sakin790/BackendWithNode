import express from "express";
import { registerUser, healthCheck } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/healthCheck").get(healthCheck);
export default router;
