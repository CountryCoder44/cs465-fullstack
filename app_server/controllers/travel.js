/* Trip data now lives in app_server/data/trips.json instead of an inline array. */
const trips = require('../data/trips.json');

/* GET travel page. Builds the view model and renders the travel template. */
const travel = (req, res) => {
    res.render('travel', {
        title: 'Travlr Getaways - Travel',
        travelSelected: true,
        trips
    });
};

module.exports = {
    travel
};
