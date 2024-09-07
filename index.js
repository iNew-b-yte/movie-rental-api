const express = require("express");
const app = express();
const winston = require("winston");
// const debug = require("debug")("app:genre");
// const morgan = require("morgan");


require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);
// require("./startup/validation")();

// TESTING the uncaughtException & unhandledRejection event 
// const p = new Promise((resolve, reject) => {
//     setTimeout(() =>{
//         reject(new Error("failed promise"));
//     },2000)
// });

// p.then(res => console.log(res));

// if(app.get('env') === 'production') {
//     app.use(morgan('tiny'));
//     debug('production error');
// }


const port = process.env.PORT || 3000;
const server = app.listen(port,()=>{
    winston.info(`Server started at port ${port}`);
});

module.exports = server;