// const jwt = require('jsonwebtoken');
// const User = require('../models/users');
// exports.authenticate = async (req, res, next) => {
//     try {
//         //console.log("hey");
//         const token = req.header('Authorization');
//         // console.log("token", token);
//         const user = jwt.verify(token, "#@focus28ABCDabcd");
//         // console.log("this is user id", user.newUserId);
//         User.findByPk(user.newUserId)
//             .then(user => {
//                 console.log("json.stringyfy", JSON.stringify(user));
//                 req.user = user;
//                 next();
//             })
//             .catch(err => { throw new Error(err) })
//     }
//     catch (err) {
//         console.log(err);
//         return res.status(401).json({ success: false });
//     }
// }

const jwt = require('jsonwebtoken');
const User = require('../models/users');

exports.authenticate = async (req, res, next) => {
    try {
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






