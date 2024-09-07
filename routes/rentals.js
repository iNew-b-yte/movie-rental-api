const { Rental, validate } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movies");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
// Fawn.init(mongoose);

router.get('/', async (req,res) => {
    const rentals = await Rental.find();
    res.send(rentals);
});

router.get('/:id', async (req,res) => {
    const rental = await Rental.find({_id: req.params.id});

    if(!rental) return res.status(400).send("Rental with given id not found");
    res.send(rental);
});

router.post('/', async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send({error:{errMsg: error.details[0].message}});

    let customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send("Invalid customer id");
    
    let movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send("Invalid movie id");

    if(movie.numberInStock === 0) return res.status(400).send("Movie not available")

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone:customer.phone
        },
        movie:{
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    // try {

    //     new Fawn.Task()
    //         .save('rentals',rental)
    //         .update('movies',{_id: movie._id},{
    //             $inc: { numberInStock: -1 }
    //         })
    //         .run();

    //         res.send(rental);

    // } catch(e) {
    //     return res.status(500).send(e);
    // }

    rental = await rental.save();

    movie.numberInStock--;
    await movie.save();

    res.send(rental);
});


module.exports = router;