const mongoose = require("mongoose");
const {genreSchema} = require("./genres");
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
    title: {
        type:String, 
        required:true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required:true
    },
    numberInStock: {
        type: Number,
        min:0,
        max:255
    },
    dailyRentalRate: {
        type: Number,
        min:0,
        max:255
    },
});

const Movie = mongoose.model('Movie', movieSchema);

function validate(movie) {
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().strict().min(0).required(),
        dailyRentalRate: Joi.number().strict().min(0).required()
    });

    return schema.validate({
        title:movie.title,
        genreId:movie.genreId,
        numberInStock:movie.numberInStock,
        dailyRentalRate:movie.dailyRentalRate
    });
}

exports.Movie = Movie;
exports.validate = validate;