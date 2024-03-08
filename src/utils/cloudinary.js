import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/* .Env not working so i do that , please ignore it */
cloudinary.config({
  cloud_name: "dgrb2e2rh",
  api_key: "514711175527823",
  api_secret: "2orhRNjGzAQwUaBumwsFi6aNHL4",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(response);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
