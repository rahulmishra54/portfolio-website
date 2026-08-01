import Project from "../models/Project.js";
import Blog from "../models/Blog.js";
import Skill from "../models/Skill.js";
import Certificate from "../models/Certificate.js";
import Message from "../models/Message.js";

const getDashboard = async (req, res) => {
  try {
    const projects = await Project.countDocuments();
    const blogs = await Blog.countDocuments();
    const skills = await Skill.countDocuments();
    const certificates = await Certificate.countDocuments();
    const messages = await Message.countDocuments();

    const latestProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

    const latestMessages = await Message.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      projects,
      blogs,
      skills,
      certificates,
      messages,
      latestProjects,
      latestBlogs,
      latestMessages,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { getDashboard };