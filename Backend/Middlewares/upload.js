const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure your Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SCECRET,
});

// Define storage for user profile uploads
const userStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'eventManagement/users', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file types
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional image transformations
  },
});

// Define storage for event banners
const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'eventManagement/banners', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'], // Allowed file types
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional image transformations
  },
});

// Multer middleware for profile uploads
const profileUpload = multer({ storage: userStorage });

// Multer middleware for banner uploads
const bannerUpload = multer({ storage: eventStorage });

module.exports = { profileUpload, bannerUpload };
