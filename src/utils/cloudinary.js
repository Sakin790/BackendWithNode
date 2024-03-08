import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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

     fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    //fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
