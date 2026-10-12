const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('users');

// POST: /register - create a new user and return a JWT
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const register = async (req, res) => {
    // Validate message to ensure that all parameters are present
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    const user = new User({
        name: req.body.name,   // Set User name
        email: req.body.email  // Set e-mail address
    });
    user.setPassword(req.body.password); // Set user password (hash + salt)

    try {
        await user.save();
        // Return new user token
        const token = user.generateJWT();
        return res
            .status(200)
            .json({ token });
    } catch (err) {
        // Duplicate email (unique index) or validation failure
        return res
            .status(400)
            .json(err);
    }
};

// POST: /login - authenticate an existing user and return a JWT
// Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const login = (req, res) => {
    // Validate message to ensure that email and password are present
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ message: 'All fields required' });
    }

    // Delegate authentication to passport (local strategy) - no session,
    // the JWT carries the identity on later requests
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            // Error in Authentication Process
            return res
                .status(404)
                .json(err);
        }
        if (user) {
            // Auth succeeded - generate JWT and return to caller
            const token = user.generateJWT();
            return res
                .status(200)
                .json({ token });
        }
        // Auth failed - return error
        return res
            .status(401)
            .json(info);
    })(req, res);
};

module.exports = {
    register,
    login
};
