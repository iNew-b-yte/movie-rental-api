const winston = require("winston");
module.exports = function(err, req, res, next) {
    winston.error(err.message, err);
    //log err
    res.status(500).send("Exception occurred");
}