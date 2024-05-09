
const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = async (req, res, next) => {
    try {
        console.log("#authentication")
        const token = req.header('Authorization');
        console.log("#token", token);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization header missing' });
        }

        const user = jwt.verify(token, "#@focus28ABCDabcd");
        console.log("#user", user)
        const foundUser = await User.findByPk(user.newUserId);
        console.log("foundUser", foundUser)

        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        console.log("#req.user", req.params);
        req.user = foundUser;
        next();

    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
}






