const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:5,
        maxlength:50
    },
    email:{
        type: String,
        required: true,
        unique:true,
        minlength:5,
        maxlength:255
    },
    password:{
        type: String,
        required: true,
        minlength:5,
        maxlength:1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const _jwt = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("pkey"));
    return _jwt;
}

const User = mongoose.model('User',userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate({
        name: user.name,
        email: user.email,
        password: user.password
    });
}

exports.validateUser = validateUser;
exports.User = User;