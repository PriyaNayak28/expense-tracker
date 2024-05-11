
const jwt = require('jsonwebtoken');
const User = require('../models/usersM');

exports.authenticate = async (req, res, next) => {
    try {
        console.log("#authentication")
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization header missing' });
        }
        const user = jwt.verify(token, "#@focus28ABCDabcd");
        const foundUser = await User.findByPk(user.newUserId);
        if (!foundUser) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = foundUser;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
    }
}






