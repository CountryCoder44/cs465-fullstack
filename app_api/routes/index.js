const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT - guards the routes that change data.
// Expects an "Authorization: Bearer <token>" header; on success the
// verified claims are placed on req.auth for the controller to use.
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const headers = authHeader.split(' ');
    if (headers.length < 2 || headers[0] !== 'Bearer') {
        console.log('Not enough tokens in Auth Header: ' + headers.length);
        return res.sendStatus(401);
    }

    const token = headers[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            // Bad signature or expired token
            console.log('Token Validation Error!');
            return res.status(401).json({ message: 'Token Validation Error!' });
        }
        req.auth = verified; // Set the auth param to the decoded object
        next();
    });
}

// Define routes for user registration and login
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

// Define route for our trips endpoint
router
    .route('/trips')
    .get(tripsController.tripsList)                      // GET Method routes tripsList (public)
    .post(authenticateJWT, tripsController.tripsAddTrip); // POST Method adds a Trip (secured)

// GET Method routes tripsFindByCode - requires parameter (public)
// PUT Method routes tripsUpdateTrip - requires parameter (secured)
// DELETE Method routes tripsDeleteTrip - requires parameter (secured)
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip)
    .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;
