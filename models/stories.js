// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var storySchema = new Schema({
    description: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        required: true
    },
    recurring: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Stories = mongoose.model('Story', storySchema);

// make this available to our Node applications
module.exports = Stories;
