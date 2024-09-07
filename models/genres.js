const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    total: {
        type: Number,
        min:0
    }
});

const Genre = mongoose.model('Genre',genreSchema);

function validateGenres(genres) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        total: Joi.number().strict().integer().required()
    });

    return schema.validate({
        name:genres.name,
        total: genres.total
    });
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenres;