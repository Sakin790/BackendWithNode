import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
});

const healthCheck = asyncHandler(async (req, res) => {
  console.log(req.id);
  res.status(200).json({
    message: "Server is Working fine",
  });
});

export { registerUser, healthCheck };
