import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  content: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "",
  },
  thumbnail: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;