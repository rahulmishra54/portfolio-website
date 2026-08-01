import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (file, folder) => {
  if (file?.buffer) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(file.buffer);
    });
  }

  return await cloudinary.uploader.upload(file, {
    folder,
  });
};

const deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export { uploadImage, deleteImage };
export default cloudinary;