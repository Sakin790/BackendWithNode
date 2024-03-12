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
/* userSchema er moddhe generateAccessToken function inject korechi,
use for short lived
*/
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    "NDBSDBJDGUEDahgdc85852dfcc",
    {
      expiresIn: "1d",
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    "BDNajsbasasndh5417SBKAJDB",
    {
      expiresIn: "10d",
    }
  );
};

export const User = mongoose.model("user", userSchema);
