const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/travlr';

mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Close the connection cleanly, then hand control back to the caller so it
// can finish shutting the process down (or, for nodemon, restart it).
// Mongoose 7+ dropped callback support on close(), so chain off the promise.
const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close().then(() => {
        console.log(`Mongoose disconnected through ${msg}`);
        callback();
    });
};

// nodemon restarts: close once, then re-emit SIGUSR2 to ourselves so
// nodemon's own default handler can continue the restart.
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// Ctrl-C in the terminal.
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

// Container/orchestrator shutdown (e.g. Heroku dyno cycling).
process.on('SIGTERM', () => {
    gracefulShutdown('app shutdown', () => {
        process.exit(0);
    });
});

require('./travlr');
