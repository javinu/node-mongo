const User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../configs/config');
const crypto = require('../logic/crypto');

async function login(req, res, next)  {
    User.find({ username: req.body.username}, async function (err, users) {
        if (err) {
            res.status(500).send('Oops, an error ocurred');
        }

        if (users.length == 1) {
            var passwordMatches = await crypto.comparePassword(users[0].password, req.body.password);
            if(passwordMatches) {
                const payload = {
                    user: req.body.user
                };
                const token = jwt.sign(payload, config.key, {
                    expiresIn: 1440
                });
                res.status(200).json({token: token});
            } else {
                res.status(403).json({message: "invalid credentials"});
            }          
        } else {
            res.status(403).json({message: "invalid credentials"});
        }
    })
}

module.exports = {login}