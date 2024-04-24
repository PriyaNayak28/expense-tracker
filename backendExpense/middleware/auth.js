const jwt = require('jsonwebtoken');
const User = require('../models/users');
exports.authenticate = async (req, res, next) => {
    try {
        console.log("hey");
        const token = req.header('Authorization');
        console.log("token", token);
        const user = jwt.verify(token, "#@focus28ABCDabcd");
        console.log("this is user id", user.userId);
        User.findByPk(user.userId)
            .then(user => {
                console.log(JSON.stringify(user));
                req.user = user;
                next();
            })
            .catch(err => { throw new Error(err) })
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
}


