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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    downloadCount: {
        type: Number,
        default: 0
    }
});


const App = mongoose.model('App', appSchema);


module.exports = App;
