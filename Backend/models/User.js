const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        unique: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit mobile number']
    },
    role: {
        type: String,
        enum: ['user', 'host', 'admin'],
        default: 'user'
    },
    hostedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    attendedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    registeredEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    savedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    profilePicture: {
        type: String
    },
    bio: {
        type: String,
        maxlength: 500
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    socialLinks: {
        facebook: { type: String, match: [/^https?:\/\/(www\.)?facebook\.com\/.+$/, 'Invalid Facebook URL'], default: '' },
        twitter: { type: String, match: [/^https?:\/\/(www\.)?twitter\.com\/.+$/, 'Invalid Twitter URL'], default: '' },
        instagram: { type: String, match: [/^https?:\/\/(www\.)?instagram\.com\/.+$/, 'Invalid Instagram URL'], default: '' }
    },    
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpiresAt: { type: Date }
}, {
    timestamps: true
});



module.exports = mongoose.model('User', userSchema);
