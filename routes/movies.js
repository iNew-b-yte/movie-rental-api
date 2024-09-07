const express = require("express");
const {Movie, validate} = require("../models/movies");
const {Genre} = require("../models/genres");
const auth = require("../middleware/auth");
const router = express.Router();

router.get('/', async (req,res) => {
    const movies = await Movie
        .find()
        .sort('name');
    res.send(movies);
});

router.get('/:id', async (req,res) => {
    const id = req.params.id;
    const movie = await Movie
        .find({_id:id})
    res.send(movie);
});

router.post('/', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send({error: {errMsg: error.details[0].message}});

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Invalid genre")

    const movie = new Movie({
        title: req?.body?.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req?.body?.numberInStock,
        dailyRentalRate: req?.body?.dailyRentalRate
    });

    const result = await movie.save();
    res.send(result);
});

router.put('/:movieId', auth, async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send({error: {errMsg: error.details[0].message}});

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Invalid genre")

    const _movie = await Movie.findByIdAndUpdate(req.params.movieId, {
        $set:{
            title: req?.body?.title,
            genre :{
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req?.body?.numberInStock,
            dailyRentalRate: req?.body?.dailyRentalRate
        }
    }, {new: true})

    if(!_movie) return res.status(404).send("Movie with given id not found");

    res.send(_movie);
});


router.delete('/:movieId', auth, async(req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.movieId);
    if(!movie) return res.status(404).send("Movie with given ID not found");
    res.send(movie);
});

module.exports = router;