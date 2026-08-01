import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    heroTitle: {
      type: String,
      default: "",
    },
    heroDescription: {
      type: String,
      default: "",
    },
    aboutMe: {
      type: String,
      default: "",
    },
    github: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    profileUrl: {
      type: String,
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;