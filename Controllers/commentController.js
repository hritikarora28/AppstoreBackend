const Comment = require('../models/commentModel');

// Add a comment to a product
exports.addComment = async (req, res) => {
    const { appId, comment } = req.body;

    try {
        const newComment = new Comment({
            user: req.user._id,
           app: appId,
            comment
        });
        await newComment.save();
        res.status(201).json({ message: 'Comment added', newComment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCommentsByApp = async (req, res) => {
    try {
        const comments = await Comment.find({ app: req.params.appId }).populate('user', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

