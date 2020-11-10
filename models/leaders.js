let mongoose = require("mongoose");
let schema = mongoose.Schema;

let leaderSchema = new schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        default: ''
    },
    abbr: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default:false    
    },
}, {
    timestamps: true
});

let Leaders = mongoose.model('Leader', leaderSchema);
module.exports = Leaders;