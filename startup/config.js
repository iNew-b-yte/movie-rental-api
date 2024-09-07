const config = require("config");

module.exports = function () {
    if (!config.get("pkey")) {
        throw new Error("FATAL ERROR: pkey is undefined");
    }
    // console.log("Name :",config.get('name'));
    // console.log("Mail server :",config.get('mail.host'));
    // console.log("Mail Password :",config.get('mail.password'));
}