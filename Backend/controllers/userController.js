const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require("mongoose")
const cloudinary = require('cloudinary').v2;

const {sendResetPwdEmail,sendResetSuccessEmail } = require("../utils/email");




//Get Users
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params; // Use route params instead of request body

        // Validate userId
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }
        // Fetch only required fields
        const userData = await User.findById(userId, "username email profilePicture hostedEvents attendedEvents bio registeredEvents savedEvents");

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
         
        console.log(userData)
        res.status(200).json({ userData });
    } catch (err) {
        console.error("Error retrieving user profile:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        // Pagination and Search Logic
        const skip = (page - 1) * limit;
        const query = search
            ? { username: { $regex: search, $options: "i" } } // Case-insensitive search
            : {};

        // Fetch users with pagination and exclude sensitive fields like password
        const users = await User.find(query)
            .select("username email profilePicture bio") // Include only necessary fields
            .skip(skip)
            .limit(parseInt(limit));

        // Total count for pagination metadata
        const totalUsers = await User.countDocuments(query);

        // Response with users and pagination metadata
        res.status(200).json({
            users,
            pagination: {
                total: totalUsers,
                page: parseInt(page),
                totalPages: Math.ceil(totalUsers / limit),
                limit: parseInt(limit),
            },
        });
    } catch (err) {
        console.error("Error retrieving users:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


//Update fields
const forgotPassword = async(req,res)=>{
     try{
        const {email} = req.body;

        const user = await User.findOne({email})
        if(!user){
            res.status(404).json({message:'User Not Found !!!'})
        }

       const resetToken = crypto.randomBytes(40).toString('hex');
       const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

       user.passwordResetToken = resetToken;
       user.passwordResetTokenExpiresAt = resetTokenExpiresAt

       await sendResetPwdEmail(email,`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`)

       return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email"
    });

     }catch(err){
        console.log('err in forgot password',err)
     }
    
}


const updatePassword = async (req, res) => {
    try {
        const {token} = req.params
        const {  newPassword } = req.body;

        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiresAt = undefined;
        await user.save()

        await sendResetSuccessEmail(user.email,user.username)

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.log("Error updating password:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const updateProfile = async (req, res) => {
    const { userId } = req.params; // Extract userId from params
    let { username, fullName, email, mobile, bio, socialLinks } = req.body;
    let profilePicture = req.body.profilePicture; // Check if profile picture URL is passed directly

    try {
        // Handle file upload for profilePicture if new file is uploaded
        if (req.file && req.file.path) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "eventManagement/users",
                });
                profilePicture = result.secure_url; // Update with the Cloudinary URL
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res
                    .status(500)
                    .json({ message: "Error uploading profile picture" });
            }
        }

        // Update the user with provided fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(username && { username }),
                ...(profilePicture && { profilePicture }),
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(mobile && { mobile }),
                ...(bio && { bio }),
                ...(socialLinks && { socialLinks }),
            },
            { new: true, runValidators: true } // Return updated user and validate inputs
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Error in updating profile", err);
        return res.status(500).json({ message: "Error in updating profile" });
    }
};





//get Events
const getHostedEvents = async (req, res) => {
    const { userId } = req.params; 

    try {
        const user = await User.findById(userId ).populate('hostedEvents');
    
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hostedEvents = user.hostedEvents;

        return res.status(200).json({
            message: "Hosted events fetched successfully",
            hostedEvents,
        });
    } catch (err) {
        console.error("Error in fetching hosted events:", err);
        return res.status(500).json({
            message: "An error occurred while fetching hosted events",
            error: err.message, 
        });
    }
};

const getAttendedEvents = async (req, res) => {
    const { userId} = req.params; 

    try {
        const user = await User.findById(userId).populate('attendedEvents');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        console.log("userrrrr :",user)
        const attendedEvents = user.attendedEvents;
       

        return res.status(200).json({
            message: "Atteded events fetched successfully",
            attendedEvents,
        });
    } catch (err) {
        console.error("Error in fetching Attended events:", err);
        return res.status(500).json({
            message: "An error occurred while fetching Attended events",
            error: err.message, 
        });
    }
};

const getSavedEvents = async(req,res)=>{
    const {userId} = req.params ;
    try {
        const user = await User.findById(userId).populate('savedEvents');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const savedEvents = user.savedEvents;

        return res.status(200).json({
            message: "Saved events fetched successfully",
            savedEvents,
        });
    } catch (err) {
        console.error("Error in fetching Saved events:", err);
        return res.status(500).json({
            message: "An error occurred while fetching Saved events",
            error: err.message, 
        });
    }
}


const saveEvent = async(req,res)=>{
    const {username,eventId} = req.body ;
    try{
        const user = await User.findOne({username})
        if(user.savedEvents.includes(eventId)){
            console.log("event already saved")
        }
        user.savedEvents.push(eventId)
        await user.save()
        return res.status(200).json({message:"Event Saved Successfully"})
    }catch(err){
        console.error("Error in saving event:", err);
        return res.status(500).json({
            message:"An err occurred while saving event",
            error:err.message,
        })
    }
}

const unSaveEvent = async(req,res)=>{
    const {username,eventId} = req.body ;
    try{
        const user = await User.findOne({username})
        if(!user.savedEvents.includes(eventId)){
            console.log("event not saved")
        }
        user.savedEvents.remove(eventId)
        await user.save()
        return res.status(200).json({message:"Event UnSaved Successfully"})
    }catch(err){
        console.error("Error in unSaving event:", err);
        return res.status(500).json({
            message:"An err occurred while unSaving event",
            error:err.message,
        })
    }
}

const cancelRegistration = async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if the user is in the registrations list
        if (!event.registrations.includes(userId)) {
            return res.status(400).json({ message: "You didn't register for this event!" });
        }

        // Remove the user from the registrations list
        event.registrations = event.registrations.filter(attendee => attendee.toString() !== userId);

        // Save the updated event
        await event.save();

        return res.status(200).json({ message: "Registration cancelled successfully" });
    } catch (err) {
        console.error("Error in canceling registration:", err);
        return res.status(500).json({
            message: "An error occurred while canceling registration",
            error: err.message,
        });
    }
};











module.exports = {
    getUserProfile,
    getAllUsers,
    forgotPassword,
    updatePassword,
    updateProfile,
    getHostedEvents,
    getAttendedEvents,
    getSavedEvents,
    saveEvent,
    unSaveEvent,
    cancelRegistration,
    
    
};
