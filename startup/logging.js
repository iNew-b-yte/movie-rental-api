const winston = require("winston");
// require("winston-mongodb");

module.exports = function () {
    process.on('uncaughtException', (err) => {
        winston.error(err.message, err);
        process.exit(1);
    });
    
    process.on('unhandledRejection', (err) => {
        winston.error(err.message, err);
        process.exit(1);
    });
    
    
    winston.add(new winston.transports.Console({'level':'info'}));
    winston.add(new winston.transports.File({filename: 'logfile.log'}));
    // winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly'}));
}