const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Ensure uploads directory exists
const ensureUploadDir = async () => {
  const dir = './uploads';
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
};

ensureUploadDir();

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|txt|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, TXT, DOC, and DOCX files are allowed!'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload;