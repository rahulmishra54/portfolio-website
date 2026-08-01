import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      default: "",
    },
    contentType: {
      type: String,
      default: "application/pdf",
    },
    size: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;