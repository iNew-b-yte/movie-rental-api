const express = require("express");
const { User, validateUser } = require("../models/users");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req,res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send({error: error.details[0].message});

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send("User already exists");

    user = new User(_.pick(req.body,["name","email","password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,["_id","name","email"]));
});

router.put('/:id', auth,async (req,res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send({error: error.details[0].message});

    const user = await User.findByIdAndUpdate(id,{
        $set:{
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    }, {new: true});
    if(!user) return res.status(400).send("Invalid user ID");

    res.send(user);
});

module.exports = router;