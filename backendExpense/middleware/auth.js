
const jwt = require('jsonwebtoken');
const User = require('../models/usersM');

exports.authenticate = async (req, res, next) => {
    try {
        console.log("#authentication")
        const token = req.header('Authorization');
        console.log(token, "in middleware");
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization header missing' });
        }
        const user = jwt.verify(token, "#@focus28ABCDabcd");
        console.log("middlewear user", user);
        const foundUser = await User.findByPk(user.newUserId);
        console.log("middleweare ", foundUser);
        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = foundUser;
        console.log("req.user", req.user);
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
}






