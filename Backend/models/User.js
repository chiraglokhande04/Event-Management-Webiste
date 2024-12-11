const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
       
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['user', 'host', 'admin'], 
        default: 'user'
    },
    eventsHosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    eventsAttended: [{
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
    isVerified:{
        type:Boolean,
        default:false
    },
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        instagram: { type: String }
    },
    verificationToken:{type:String},
    verificationTokenExpiresAt:{type:Date},
    passwordResetToken:{type:String},
    passwordResetTokenExpiresAt:{type:Date},
}, {
    timestamps: true  
});

module.exports = mongoose.model('User', userSchema);
