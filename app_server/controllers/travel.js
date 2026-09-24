/* Trip data now comes from the app_api REST endpoint instead of trips.json. */
const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/* GET travel page. Fetches trips from the API, then renders the travel template. */
const travel = async (req, res) => {
    try {
        const response = await fetch(tripsEndpoint, options);
        const json = await response.json();

        let trips = [];
        let message = null;
        if (!Array.isArray(json)) {
            message = 'API lookup error';
        } else if (!json.length) {
            message = 'No trips exist in our database!';
        } else {
            trips = json;
        }

        res.render('travel', {
            title: 'Travlr Getaways - Travel',
            travelSelected: true,
            trips,
            message
        });
    } catch (err) {
        res.status(500);
        res.render('travel', {
            title: 'Travlr Getaways - Travel',
            travelSelected: true,
            trips: [],
            message: 'Unable to reach the trips API.'
        });
    }
};

module.exports = {
    travel
};
