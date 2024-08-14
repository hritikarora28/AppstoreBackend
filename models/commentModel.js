const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    comment:
    {
        type: String,
        required: true
    },
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    app:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'App', required: true
    }
});


const Comment = mongoose.model('Comment', commentSchema);


module.exports = Comment;