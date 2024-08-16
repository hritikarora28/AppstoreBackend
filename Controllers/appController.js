const App = require('../models/appModel');


// Create Product (Admin Only)
exports.addApp = async (req, res) => {
    const { name,description,
        version,
        releasedate,
        rating,
        genre, } = req.body;


    try {
        const app = new App({
            name,
            description,
            version,
            releasedate,
            rating,
            genre,
            user: req.user._id,
        });
        await app.save();
        res.status(201).json({ message: 'App added', app });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get All Products (Accessible by all logged-in users)
// Get All Apps (Admins can see download counts, others cannot)
exports.getApps = async (req, res) => {
    try {
        const apps = await App.find({});

        // Check if the user is an admin
        const isAdmin = req.user && req.user.role === 'admin';

        // Respond with downloadCounts only if user is an admin
        const responseApps = apps.map(app => ({
            name: app.name,
            version: app.version,
            description: app.description,
            rating: app.rating,
            releasedate: app.releasedate,
            genre: app.genre,
            downloadCount: isAdmin ? app.downloadCount : undefined, // Include downloadCount only if admin
            user: app.user
        }));

        res.json(responseApps);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Get Product By ID (Accessible by all logged-in users)
// Get App By ID (Admin can see download count, others cannot)
exports.getAppById = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        // Check if the user is an admin
        const isAdmin = req.user && req.user.role === 'admin';

        // Respond with downloadCount only if user is an admin
        res.json({
            app: {
                name: app.name,
                version: app.version,
                description: app.description,
                rating: app.rating,
                releasedate: app.releasedate,
                genre: app.genre,
                downloadCount: isAdmin ? app.downloadCount : undefined, // Include downloadCount only if admin
                user: app.user
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};



// Update Product (Admin Only)
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


// Delete Product (Admin Only)
exports.deleteApp = async (req, res) => {
    try {

        const app = await App.findById(req.params.appId);


        if (!app) return res.status(404).json({ message: 'App not found' });


        if (app.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this app' });
        }
        console.log(" app found ",app)


      await  App.findByIdAndDelete(req.params.appId);
        res.json({ message: 'App deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get comments for a product (Admin Only)
exports.getCommentsByApp = async (req, res) => {
    try {
        const comments = await Comment.find({ app: req.params.appID }).populate('user', 'username');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Increment download count and return the file (Admin Only)
exports.downloadApp = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        // Increment download count
        app.downloadCount += 1;
        await app.save();

        // Logic for file download goes here (e.g., streaming the file to the user)

        res.json({ message: 'Download successful', app });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get download count (Admin Only)
exports.getDownloadCount = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);

        if (!app) return res.status(404).json({ message: 'App not found' });

        res.json({ downloadCount: app.downloadCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

