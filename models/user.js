const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    enroll: String,
    role: String,   // ✅ comma added
    otp: String,
    otpExpiry: Date
});

module.exports = mongoose.model('User', userSchema);