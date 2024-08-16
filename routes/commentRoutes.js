const express = require('express');
const {
    addComment,
    getCommentsByApp,
    deleteCommentsById,
    
} = require('../Controllers/commentController');
const { protect, admin } = require('../Middleware/authMiddleware');
const router = express.Router();


router.post('/', protect, addComment);                   // Create Product (Admin only)
router.get('/:appId', protect,getCommentsByApp);                          // Read All Products (Any logged-in user)
router.delete('/:commentId',protect,admin,deleteCommentsById);



module.exports = router;