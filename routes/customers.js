const { Customer, validate } = require("../models/customers");
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get('/', async (req, res) => {
    const customer = await Customer.find().sort('name');

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send("Customer with given ID not found");

    res.send(customer);
});

router.post('/',async (req, res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send({error:{message: error.details[0].message}});

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    const _customer = await customer.save();
    res.send(_customer);
});

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body);
    if(error) return res.status(400).send({error:{message: error.details[0].message}});

    const customer = await Customer.findByIdAndUpdate(req.params.id,{
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    },
    {
        new: true
    });
    if(!customer) return res.status(404).send("Customer with given ID not found");

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if(!customer) return res.status(404).send("Customer with given ID not found");

    res.send(customer);
});

module.exports = router;
