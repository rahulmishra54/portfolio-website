import Experience from "../models/Experience.js";

const createExperience = async (req, res) => {
  try {
    const experience = await Experience.create(req.body);

    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find();

    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found",
      });
    }

    res.status(200).json({
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createExperience,
  getExperiences,
  getExperience,
  updateExperience,
  deleteExperience,
};