const express = require('express');
const {
    addApp,
    getApps,
    getAppById,
    updateApp,
    deleteApp,
    downloadApp,
    getDownloadCount
} = require('../Controllers/appController');
const { protect, admin } = require('../Middleware/authMiddleware');
const router = express.Router();


router.post('/', protect, admin, addApp);                   // Create Product (Admin only)
router.get('/', protect, getApps);                          // Read All Products (Any logged-in user)
router.get('/:appId', protect, getAppById);             // Read Single Product (Any logged-in user)
router.put('/:appId', protect, admin, updateApp);       // Update Product (Admin only, must own the product)
router.delete('/:appId', protect, admin, deleteApp);    // Delete Product (Admin only, must own the product)
router.post('/:appId/download', protect, downloadApp);      // Download App (Increment download count)
router.get('/:appId/download-count', protect, admin, getDownloadCount); // Get Download Count (Admin only)

module.exports = router;
