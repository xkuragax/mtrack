const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (destination) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads', destination);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
};

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const uploadCover = multer({
  storage: createStorage('covers'),
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/jpg', 'image/webp']),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadTrack = multer({
  storage: createStorage('tracks'),
  fileFilter: fileFilter(['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg']),
  limits: { fileSize: 50 * 1024 * 1024 }
});

const uploadMaterial = multer({
  storage: createStorage('materials'),
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = {
  uploadCover,
  uploadTrack,
  uploadMaterial
};
