const config = require("config");
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Unauthorized. No token provided");

    try {
        const decoded = jwt.verify(token, config.get('pkey'));
        req.user = decoded;
        next();
    } catch(ex) {
        res.status(400).send({error:"Invalid token"});
    }
} 