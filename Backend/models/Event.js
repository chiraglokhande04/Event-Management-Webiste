const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
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
    capacity: {
        type: Number,
        min: 50
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
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
