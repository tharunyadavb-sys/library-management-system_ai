const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    studentId: String,
    bookId: String,
    fromDate: Date,
    toDate: Date,
    returned: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Issue', issueSchema);