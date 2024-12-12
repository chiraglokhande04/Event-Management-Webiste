const express = require('express');
const userRouter = express.Router();  // Use express.Router() instead of express()
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/logout', authController.logout);
userRouter.post('/verifyEmail', authController.verifyEmail);

userRouter.get('/getuser/:userId', userController.getUserProfile);
userRouter.get('/getAllUsers', userController.getUserProfile);
userRouter.get('/hostedEvents/:userId', userController.getHostedEvents);
userRouter.get('/attendedEvents/:userId', userController.getAttendedEvents);

userRouter.post('/forgotPassword', userController.forgotPassword);
userRouter.patch('/updarePassword', userController.updatePassword);
userRouter.put('/updarePofile', userController.updateProfile);
userRouter.patch('/cancelRegistration/:eventId', userController.cancelRegistration);





module.exports = userRouter;
