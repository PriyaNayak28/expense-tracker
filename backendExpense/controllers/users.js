const Post = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function isStringValidOrNot(string) {
    return string === undefined || string.length === 0;
}

exports.NewUserSignUp = async (req, res, next) => {
    try {
        const { userName, email, password } = req.body;
        // console.log("email", email);

        if (isStringValidOrNot(userName) ||
            isStringValidOrNot(email ||
                isStringValidOrNot(password))) {
            return res.status(400).json({ err: "something is missing" })
        }

        const existingUser = await Post.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            console.log(err);
            await Post.create({ userName, email, password: hash });
        })

        res.status(201).json(Post);
    }
    catch (error) {
        console.error('Error uploading post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//login

function genrateAccessSecretToken(id, userName, ispremiumuser) {
    return jwt.sign({ newUserId: id, userName: userName, ispremiumuser }, "#@focus28ABCDabcd")
}
exports.existingUserLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (isStringValidOrNot(email) || isStringValidOrNot(password)) {
            return res.status(400).json({ message: 'Email id or password is missing', success: false });
        }

        const user = await Post.findAll({ where: { email } });
        if (user.length > 0) {
            const hash = user[0].password;
            const result = await bcrypt.compare(password, hash);
            if (result) {
                console.log("Password matches!");
                // You can handle successful login here
                return res.status(200).json({ message: 'Login successful', success: true, token: genrateAccessSecretToken(user[0].id, user[0].userName, user[0].ispremiumuser), id: user[0].id, userName: user[0].userName });
            } else {
                console.log("Invalid password!");
                return res.status(401).json({ message: 'Invalid password', success: false });
            }
        } else {
            return res.status(404).json({ message: 'User not found', success: false });
        }
    } catch (err) {
        console.log("error", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}


