const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure your Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY ,
  api_secret: process.env.API_SECRET,
});


const userStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'eventManagement/users', // Folder name in Cloudinary
      allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file types
      transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional image transformations
    },
  });


const eventStorage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"eventManagement/banners",
        allowed_formats: ['jpg', 'png', 'jpeg','pdf'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }],

    },
})

const profileUpload = multer({ userStorage });
const bannerUpload = multer({eventStorage})

module.exports = {profileUpload,bannerUpload};