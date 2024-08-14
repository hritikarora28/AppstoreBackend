const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const appRoutes = require('./routes/appRoute');
const userRoutes = require('./routes/userRoute');
const commentRoutes=require('./routes/commentRoutes');

dotenv.config();


const app = express();


app.use(express.json()); // Middleware to parse JSON


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
   
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed:', err.message));


// Define routes
app.use('/api/apps', appRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments',commentRoutes);



// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error!');
});




// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


