const express = require("express");
const error = require("../middleware/error");
const customer = require("../routes/customers");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
module.exports = function (app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(express.json());
    app.use("/register", users);
    app.use("/genres", genres);
    app.use("/customer", customer);
    app.use("/movies", movies);
    app.use("/rentals", rentals);
    app.use("/login", auth);
    app.use("/api/returns", returns);
    app.use(error);
}