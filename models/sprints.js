// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var sprintSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    beginDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Sprints = mongoose.model('Sprint', sprintSchema);

// make this available to our Node applications
module.exports = Sprints;
