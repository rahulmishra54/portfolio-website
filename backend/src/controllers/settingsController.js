import Settings from "../models/Settings.js";

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (settings) {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true }
      );
    } else {
      settings = await Settings.create(req.body);
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  getSettings,
  updateSettings,
};