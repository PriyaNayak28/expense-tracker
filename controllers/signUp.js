const Post = require('../models/signUp');
const path = require('path');

exports.getSignUpPage = (req, res, next) => {
    const filePath = path.join(__dirname, '../index.html');
    res.sendFile(filePath);
};

exports.addNewUsers = async (req, res, next) => {
    const { userName, email, password } = req.body;

    try {
        const post = await Post.create({
            userName,
            email,
            password
        });

        res.json(post);
    } catch (error) {
        console.error('Error uploading post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};