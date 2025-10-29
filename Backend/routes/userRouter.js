const express = require('express');
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../Middlewares/user");
const {profileUpload} = require("../Middlewares/upload")

// Public Routes (No Middleware Required)
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/logout', authController.logout);
userRouter.post('/verifyEmail', authController.verifyEmail);
userRouter.post('/forgotPassword', userController.forgotPassword);

// Protected Routes (Require authMiddleware)
userRouter.get('/profile/:userId',authMiddleware, userController.getUserProfile);
userRouter.get('/getAllUsers', authMiddleware, userController.getAllUsers);
userRouter.get('/hostedEvents/:userId', authMiddleware, userController.getHostedEvents);
userRouter.get('/attendedEvents/:userId', authMiddleware, userController.getAttendedEvents);

userRouter.patch('/updatePassword', authMiddleware, userController.updatePassword);
userRouter.put('/profile/:userId',profileUpload.single('profilePicture'), userController.updateProfile);
//userRouter.put('/updateProfile/:userId', authMiddleware,profileUpload.single('profilePicture'), userController.updateProfile);
userRouter.patch('/cancelRegistration/:eventId', authMiddleware, userController.cancelRegistration);

module.exports = userRouter;

