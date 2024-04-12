const Post = require('../models/signUp');
const path = require('path');

exports.getSignUpPage = (req, res, next) => {
    const filePath = path.join(__dirname, '../index.html');
    res.sendFile(filePath);
};

function isStringValidOrNot(string) {
    return string === undefined || string.length === 0;
}

// exports.postlogin = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ error: "Email or password missing" });
//         }
//         const user = await Post.findOne({ where: { email, password } });
//         if (!user) {
//             return res.status(400).json({ error: "Invalid email or password" });
//         }
//         res.status(200).json({ message: "Login successful", user });
//     } catch (error) {
//         console.error('Error during login:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


exports.addNewUsers = async (req, res, next) => {
    try {

        const { userName, email, password } = req.body;

        if (isStringValidOrNot(userName) ||
            isStringValidOrNot(email) ||
            isStringValidOrNot(password)) {
            return res.status(400).json({ err: "something is missing" })
        }

        const existingUser = await Post.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const post = await Post.create({
            userName,
            email,
            password
        });

        res.status(201).json(post);
    }
    catch (error) {
        console.error('Error uploading post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

