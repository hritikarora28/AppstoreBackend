const express = require('express');
const {
    addComment,
    getCommentsByApp,
    
} = require('../Controllers/commentController');
const { protect, admin } = require('../Middleware/authMiddleware');
const router = express.Router();


router.post('/', protect, addComment);                   // Create Product (Admin only)
router.get('/:appId', protect,admin, getCommentsByApp);                          // Read All Products (Any logged-in user)


module.exports = router;