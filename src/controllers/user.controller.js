import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/*Akane AccessToken and RefreshToken Bananor jonno ekta method define korechi
(user._id) pass korlei seta access and refresh token generate kore dibe
*/
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    /*model er moddhe refresh token save korabo */
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    /* generateAccessAndRefereshTokens ta AccessToken And refreshToken return
    korbe */
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }
  console.log(`${createdUser.username} just registered`);
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email);

  if (!username && !email) {
    throw new apiError(400, "username or email is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new apiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials");
  }
  /*generateAccessAndRefereshTokens ke user_id pass korai 
            accessToken, refreshToken generate koreche  */
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  /*User object theke password and refreshToken remove kore dibo */
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  /*Cookie er moddhe token gulo diye dibo ,pore okhen theke validation korbo */
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

/*Logout kora mane user er token and cookie clear kora , kintu 1st dekhte 
hobe je user already login in kina , tar jonno eka middlewarew design korte
holo jeta kina (req er moddhe user add korbe , and oi user er id diye user 
  find kore token undifined kore dibo r cookie remove kore dibo)
 */
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    /*Return new value korbe , jodi old value kore tahole toh oknae
    token thekei jacche , muloto token ta remove korte chacchi */
    {
      new: true,
    }
  );
  /*Sudhu server theke access korar jabe */
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out"));
});

const healthCheck = asyncHandler(async (req, res) => {
  console.log(req.id);
  res.status(200).json({
    message: "Server is Working fine",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.deleteMany({});
  res.status(200).json({
    message: "All User deleted successfully",
  });
});

export { registerUser, healthCheck, deleteUser, loginUser, logoutUser };
