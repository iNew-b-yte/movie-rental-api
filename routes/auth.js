const express = require("express");
const { User } = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const router = express.Router();


router.post('/', async (req,res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send({error: error.details[0].message});

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Invalid email or password");

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).send("Invalid password");

    const _jwt = user.generateAuthToken();

    res.send({Login_success:_jwt});
});

function validateUser(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate({
        email: user.email,
        password: user.password
    });
}

module.exports = router;