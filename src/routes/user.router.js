import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  registerUser,
  healthCheck,
  deleteUser,
  loginUser,
} from "../controllers/user.controller.js";
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/healthCheck").get(healthCheck);
router.route("/delete").delete(deleteUser);
router.route("/login").post(loginUser);

export default router;
