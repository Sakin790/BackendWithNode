import express from "express";
import { upload } from "../middlewares/multer.js";
import { registerUser, healthCheck } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
router.route("/healthCheck").get(healthCheck);
export default router;
