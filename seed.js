const mongoose = require('mongoose');
require('./app_server/models/db');

const Trip = require('./app_server/models/travlr');
const trips = require('./app_server/data/trips.json');

mongoose.connection.once('connected', async () => {
    try {
        await Trip.deleteMany({});
        const inserted = await Trip.insertMany(trips);
        console.log(`Seeded ${inserted.length} trip(s) into the trips collection.`);
    } catch (err) {
        console.error('Seeding failed: ', err);
    } finally {
        mongoose.connection.close();
    }
});
