import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads folder-д хадгална
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // Unique filename үүсгэх
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

// File filter - Зөвхөн зургууд (Product images)
const imageFileFilter = (req, file, cb) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Зөвхөн зураг файл зөвшөөрөгдөнө (JPG, PNG, GIF, WebP, SVG)'), false);
  }
};

// File filter - Бүх төрлийн файл (Design files for quotations)
const designFileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Design files
    'application/illustrator',
    'application/postscript',
    'image/vnd.adobe.photoshop',
    'application/x-photoshop'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Зөвшөөрөгдөөгүй файлын төрөл. Зураг, PDF, Word, PowerPoint, AI, PSD файл оруулна уу.'), false);
  }
};

// Multer configuration - Images only
const uploadImage = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for images
  }
});

// Multer configuration - Design files (larger limit)
const uploadDesign = multer({
  storage: storage,
  fileFilter: designFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for design files
  }
});

// Single file upload (images)
export const uploadSingle = uploadImage.single('file');

// Multiple files upload
export const uploadMultiple = uploadImage.array('files', 5);

// Product image upload (IMAGES ONLY)
export const uploadProductImage = uploadImage.single('image');

// Design file upload for quotations (ALL FILE TYPES)
export const uploadDesignFile = uploadDesign.single('designFile');

export default uploadImage;