const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('users');

// Local strategy: look the user up by email (instead of passport's default
// "username" field) and check the supplied password against the stored hash
passport.use(new LocalStrategy(
    {
        usernameField: 'email'
    },
    async (username, password, done) => {
        try {
            const q = await User
                .findOne({ email: username })
                .exec();

            if (!q) {
                // Email isn't registered
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!q.validPassword(password)) {
                // Password hash doesn't match
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, q);
        } catch (err) {
            return done(err);
        }
    }
));
