const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async (req, res) => {
    try {
        const q = await Model
            .find({}) // No filter, return all records
            .exec();

        // Uncomment the following line to show results of query on the console
        // console.log(q);

        if (!q || q.length === 0) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: 'No trips found' });
        }
        // Return resulting trip list
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

// GET: /trips/:tripCode - lists a single trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model
            .find({ 'code': req.params.tripCode }) // Return single record
            .exec();

        // Uncomment the following line to show results of query on the console
        // console.log(q);

        if (!q || q.length === 0) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: `Trip not found for code ${req.params.tripCode}` });
        }
        // Return resulting trip
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

// POST: /trips - Adds a new Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const q = await newTrip.save();

        // Uncomment the following line to show results of operation on the console
        // console.log(q);

        // Return the newly created trip
        return res
            .status(201)
            .json(q);
    } catch (err) {
        // Mongoose validation errors (missing required fields) are a bad request
        return res
            .status(400)
            .json(err);
    }
};

// PUT: /trips/:tripCode - Updates an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
    // Uncomment for debugging
    // console.log(req.params);
    // console.log(req.body);

    try {
        const q = await Model
            .findOneAndUpdate(
                { 'code': req.params.tripCode },
                {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                { returnDocument: 'after', runValidators: true } // Return the updated document
            )
            .exec();

        if (!q) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: `Trip not found for code ${req.params.tripCode}` });
        }
        // Return resulting updated trip
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(400)
            .json(err);
    }
};

// DELETE: /trips/:tripCode - Deletes an existing Trip
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsDeleteTrip = async (req, res) => {
    try {
        const q = await Model
            .findOneAndDelete({ 'code': req.params.tripCode })
            .exec();

        if (!q) {
            // Database returned no data
            return res
                .status(404)
                .json({ message: `Trip not found for code ${req.params.tripCode}` });
        }
        // Return the deleted trip so the client can confirm what was removed
        return res
            .status(200)
            .json(q);
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
