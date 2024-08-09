const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: false },
    studentName: { type: String, required: true },
    sendAt: { type: String, required: true },
    time: { type: String, required: true },
    content: { type: String, required: true },
});

ReplySchema.pre('save', function(next) {
    if (this.studentName) {
        this.studentName = this.studentName.trim();
    }
    next();
});

module.exports = mongoose.model('Replies', ReplySchema);
