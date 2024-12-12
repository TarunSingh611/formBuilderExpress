// backend/routes/uploads.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Get ImageKit authentication parameters
router.get('/auth', auth, uploadController.getAuthParams);

// Handle single image upload
router.post(
  '/single',
  auth,
  upload.single('image'),
  uploadController.uploadImage
);

// Handle multiple image upload
router.post(
  '/multiple',
  auth,
  upload.array('images', 5), // Max 5 images
  uploadController.uploadMultipleImages
);

// Delete image from ImageKit
router.delete('/:fileId', auth, uploadController.deleteImage);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File size cannot be larger than 5MB',
      });
    }
  }

  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }

  next(error);
});

// Export the router
module.exports = router;
