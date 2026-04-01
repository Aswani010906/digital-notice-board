const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['Whole College', 'CSE', 'EEE', 'EC', 'ME', 'CE', 'RAI', 'IEEE', 'ISTE', 'IEDC', 'TinkerHub', 'NSS', 'Sports', 'Arts Club'],
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        deadline: {
            type: Date,
        },
        attachment: {
            type: String, // URL to the file
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
        expiryDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Notice = mongoose.model('Notice', noticeSchema);
module.exports = Notice;
