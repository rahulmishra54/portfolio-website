import multer from 'multer';

// Use memory storage so uploaded files are available as buffers for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;