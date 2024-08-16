const mongoose = require('mongoose');


const appSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },
    version:
    {
        type: Number,
        required: true
    },
    description:
        { type: String ,
        required: true
},
    rating: {
        type: Number,
        default: 0
    },
    releasedate: {
        type: Date,
       
    },

    genre: {
        type: String,
        required: true
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    downloadedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' // Array to store users who downloaded the app
    }]
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
   

});


const App = mongoose.model('App', appSchema);


module.exports = App;
