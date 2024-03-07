import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "all fields are required");
  }

  const existedUser = await User.findOne({
   
    $or: [{ username }, { email }], 
  });

  if (existedUser) {
    throw new apiError(409, "username or email already exist");
  }


  const avatarLocalPath = req.files?.avatar[0]?.path;
  

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }


  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is reqired");
  }
  //cloudinary function paramiter hisbae image er path nibe...
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }

  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  //Databse a user find koro tarpor id pele, okhne theke password and refreshToken
  //remove korbo
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new apiError(500, "Something went Wrong while registering the user");
  }
  
  return res
    .status(201)
    .json(new apiResponse(200, createUser, "user registred successfully"));
});



const healthCheck = asyncHandler(async (req, res) => {
  console.log(req.id);
  res.status(200).json({
    message: "Server is Working fine",
  });
});

export { registerUser, healthCheck };
