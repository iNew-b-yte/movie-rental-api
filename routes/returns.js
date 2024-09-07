const Joi = require('joi');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');


const auth = require("../middleware/auth");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const validate = require("../middleware/validate");

router.post('/',[auth, validate(validateReturn)], asyncMiddleware(async (req, res) => {

    let rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) return res.status(404).send({error:"Rental not found"});

    if (rental.dateReturned) return res.status(400).send({error:"Return already processed"});

    rental.return();
    
    rental = await rental.save();

    await Movie.findByIdAndUpdate(req.body.movieId,{
        $inc: {numberInStock: 1}
    });

    res.send(rental);
}));

function validateReturn(obj) {
    const schema = Joi.object({
        customerId: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message('Invalid ObjectId');
            }
            return value;
        }).required(),
        movieId: Joi.string().custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message('Invalid ObjectId');
            }
            return value;
        }).required()
    });

    return schema.validate({
        customerId:obj.customerId,
        movieId: obj.movieId
    });
}

module.exports = router;