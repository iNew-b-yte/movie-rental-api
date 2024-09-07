const mongoose = require("mongoose");
const { User } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");

describe('user.generateAuthToken',() => {
    it('should validate the jwt token', () => {
        const _user = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }
        const user = new User(_user);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('pkey'));
        expect(decoded).toMatchObject(_user);
    }) 
})