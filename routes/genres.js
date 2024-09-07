const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const validateObjectID = require("../middleware/validateObjectID");
const { Genre, validate } = require("../models/genres");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post('/', auth, async (req, res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send({error: {errMsg : error.details[0].message}});

    const genre = new Genre({
        name: req.body.name,
        total: req.body.total
    });

    const _genre = await genre.save();
    res.send(_genre);
});

router.get('/:id', validateObjectID, async (req, res) => {
    const gen = await Genre.findById(req.params.id);
    if (!gen) return res.status(404).send("Genre with given ID not found");

    res.send(gen);
});

router.get('/',asyncMiddleware(async (req,res)=>{
    const genres = await Genre.find().sort('name');
    // throw new Error("Error handling testing");
    // if(!gen) return res.status(404).send("Genre with given ID not found");
    // console.log(req)
    res.send(genres);
}));

router.put('/:id', auth, validateObjectID,asyncMiddleware(async (req,res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send({error: {errMsg : error.details[0].message}});

    const gen = await Genre.findByIdAndUpdate(req.params.id,{
        name: req.body.name,
        total: req.body.total
    },{
        new: true
    });
    if(!gen) return res.status(404).send("Genre with given ID not found");

    res.send(gen);
}));



router.delete('/:id', [auth, admin, validateObjectID],async (req,res)=>{
    const gen = await Genre.findByIdAndDelete(req.params.id);
    if(!gen) return res.status(404).send("Genre with given ID not found");

    res.send(gen);
});

module.exports = router;