const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    text1: { type: String, required: true },
    text2: { type: String, required: true }
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
