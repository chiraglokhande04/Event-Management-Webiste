const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'No description provided.'
    },
    banner: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactEmail:{
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    capacity: {
        type: Number,
        min: 50,
        default: 100 // Example default
    },
    registrations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    cost: {
        type: Number,
        min: 0,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    registrationLastDate: {
        type: Date,
        required: true
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        review: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Add cross-field validation
eventSchema.pre('save', function(next) {
    if (this.startDate >= this.endDate) {
        return next(new Error('Start date must be before the end date.'));
    }
    if (this.registrationLastDate >= this.startDate) {
        return next(new Error('Registration last date must be before the start date.'));
    }
    next();
});

module.exports = mongoose.model('Event', eventSchema);
