import Certificate from "../models/Certificate.js";

const createCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();

    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json(certificate);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        message: "Certificate not found",
      });
    }

    res.status(200).json({
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createCertificate,
  getCertificates,
  getCertificate,
  updateCertificate,
  deleteCertificate,
};