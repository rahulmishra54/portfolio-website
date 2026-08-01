import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import Resume from "../models/Resume.js";

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No images uploaded",
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const result = await uploadImage(file, "portfolio");

      uploadedFiles.push({
        url: result.secure_url,
        filename: file.originalname,
        size: file.size,
      });
    }

    res.status(201).json({
      urls: uploadedFiles.map((item) => item.url),
      files: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded",
      });
    }

    const oldResume = await Resume.findOne();

    if (oldResume) {
      await deleteImage(oldResume.publicId);
      await Resume.findByIdAndDelete(oldResume._id);
    }

    const result = await uploadImage(req.file, "resume");

    const resume = await Resume.create({
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      url: resume.url,
      filename: resume.filename,
      size: resume.size,
      uploadedAt: resume.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { uploadImages, uploadResumeFile };