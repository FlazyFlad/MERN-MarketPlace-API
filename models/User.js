const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: true,
        minlength: 4,
    },
    PasswordHash: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;