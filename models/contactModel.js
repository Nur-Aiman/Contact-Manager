const mongoose = require('mongoose')
const db = require('../config/dbConnection')

db()

const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },

    contactOwner: {
        type: String,
        required: [true, 'Contact name'],
    },

    name: {
        type: String,
        required: [true, 'Contact name'],
    },

    email: {
        type: String,
        required: [true, 'Contact email'],
    },

    phone: {
        type: String,
        required: [true, 'Contact phone number'],
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
})

const Contact = new mongoose.model('Contact_Library', ContactSchema)

module.exports = Contact