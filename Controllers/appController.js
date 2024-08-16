const mongoose = require('mongoose');
const App = require('../models/appModel');

// Create App (Admin Only)
exports.addApp = async (req, res) => {
    const { name, description, version, releasedate, rating, genre, visibility } = req.body;

    try {
        const app = new App({
            name,
            description,
            version,
            releasedate,
            rating,
            genre,
            user: req.user._id,
            visibility,
        });
        await app.save();
        res.status(201).json({ message: 'App added', app });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Apps
exports.getApps = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const isAdmin = req.user && req.user.role === 'admin';

        // Extract query parameters
        const { name, genre, rating, visibility } = req.query;

        // Build query based on user's role and search parameters
        let query = isAdmin
            ? {} // Admins see all apps
            : { $or: [{ visibility: 'public' }, { user: userId, visibility: 'private' }] }; // Users see public apps and their own private apps

        if (name) {
            query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
        }

        if (genre) {
            query.genre = genre; // Exact match for genre
        }

        if (rating) {
            const [minRating, maxRating] = rating.split(',').map(Number);
            query.rating = { $gte: minRating, $lte: maxRating }; // Range for rating
        }

        if (visibility) {
            query.visibility = visibility; // Exact match for visibility
        }

        const apps = await App.find(query);

        // Modify response to include downloadCount only for apps that the user has downloaded or if the user is admin
        const responseApps = apps.map(app => {
            const hasDownloaded = app.downloadedBy.some(user => user.toString() === userId.toString());
            return {
                id: app._id,
                name: app.name,
                version: app.version,
                description: app.description,
                rating: app.rating,
                releasedate: app.releasedate,
                genre: app.genre,
                visibility: app.visibility,
                user: app.user,
                downloadCount: isAdmin || hasDownloaded ? app.downloadCount : undefined, // Only show downloadCount if admin or user has downloaded
            };
        });

        res.json(responseApps);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get App By ID
exports.getAppById = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        const userId = req.user._id;
        const isAdmin = req.user.role === 'admin';
        const isOwner = app.user.toString() === req.user._id.toString();

        if (app.visibility === 'private' && !isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Not authorized to view this app' });
        }

        const hasDownloaded = app.downloadedBy.some(user => user.toString() === userId.toString());

        res.json({
            app: {
                id: app._id,
                name: app.name,
                version: app.version,
                description: app.description,
                rating: app.rating,
                releasedate: app.releasedate,
                genre: app.genre,
                visibility: app.visibility,
                downloadCount: isAdmin || hasDownloaded ? app.downloadCount : undefined, // Show downloadCount only if user has downloaded or admin
                user: app.user,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update App (Admin Only)
exports.updateApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        if (app.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this app' });
        }

        const updatedApp = await App.findByIdAndUpdate(req.params.appId, req.body, { new: true });

        res.json({ message: 'App updated', updatedApp });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete App (Admin Only)
exports.deleteApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        if (app.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this app' });
        }

        await App.findByIdAndDelete(req.params.appId);
        res.json({ message: 'App deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Download App and Increment Download Count
exports.downloadApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        const userId = req.user._id;
        
        // Increment download count for admin
        if (!app.downloadedBy.includes(userId)) {
            app.downloadedBy.push(userId); // Track user who downloaded
        }

        // Increment total download count
        app.downloadCount += 1;

        await app.save();

        res.json({ message: 'Download successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Download Count (Admin Only)
exports.getDownloadCount = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        res.json({ downloadCount: app.downloadCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


