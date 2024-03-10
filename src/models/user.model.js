import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercasse: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

/* DataBase a save houar age ai method run hobe and password encrypt hobe,
kintu somossha holo protibar kono feild update holei password encrypt hobe
jeta thik na , tai if condition diye check korechi , jodi sudhu password 
change hoi tobei password hash hobe
*/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //jodi password modified hoi tobei password hash korbo
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* model er moddhe direct custom function define kora jai  */

/*Ami "isPasswordCorrect" name a custom function model er moddhe define korchi , 
jeta password currect kina check korbe */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
/* userSchema er moddhe generateAccessToken function inject korechi
use for short lived
*/
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    //Payload
    {
      _id: _id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

/* userSchema er moddhe generateRefreshToken function inject korechi 
use for long lived*/
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("user", userSchema);
