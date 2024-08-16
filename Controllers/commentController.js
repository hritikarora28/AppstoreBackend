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

exports.deleteCommentsById = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        // Find the comment by ID and delete it
        const comment = await Comment.findByIdAndDelete(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

