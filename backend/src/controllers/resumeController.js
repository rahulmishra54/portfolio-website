import Resume from "../models/Resume.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const result = await uploadImage(req.file.path, "resume");

    const resume = await Resume.create({
      url: result.secure_url,
      publicId: result.public_id,
    });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const replaceResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const oldResume = await Resume.findOne();

    if (oldResume) {
      await deleteImage(oldResume.publicId);
      await Resume.findByIdAndDelete(oldResume._id);
    }

    const result = await uploadImage(req.file.path, "resume");

    const resume = await Resume.create({
      url: result.secure_url,
      publicId: result.public_id,
    });

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne();

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    await deleteImage(resume.publicId);
    await Resume.findByIdAndDelete(resume._id);

    res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  uploadResume,
  getResume,
  replaceResume,
  deleteResume,
};