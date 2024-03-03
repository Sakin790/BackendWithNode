import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //uplode file
    const respone = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //file has been uplode ,, response print korle valo hoi
    console.log("Successfully uploded", respone.url);
    fs.unlinkSync(localFilePath);
    return respone;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved file
    return null;
  }
};
export { uploadOnCloudinary };
