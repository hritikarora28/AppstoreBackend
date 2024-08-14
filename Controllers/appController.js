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
exports.getApps = async (req, res) => {
    try {
        const apps = await App.find({});
        res.json(apps);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// Get Product By ID (Accessible by all logged-in users)
exports.getAppById = async (req, res) => {
    try {
        const app = await App.findById(req.params.appId);
        if (!app) return res.status(404).json({ message: 'App not found' });
        res.json(app);
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
