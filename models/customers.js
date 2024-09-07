const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model('Customer',new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone:{
        type: String,
        required: true,
        maxlength:12
    }
}));

function validateCustomer(customer) {
    const customerSchema = Joi.object({
        name: Joi.string().min(5).required(),
        phone: Joi.string().max(12).required()
    });

    return customerSchema.validate({
        name: customer.name,
        phone: customer.phone
    });
}

exports.validate = validateCustomer;
exports.Customer = Customer;