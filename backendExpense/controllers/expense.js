
const userExpense = require('../models/expense');

exports.getAddExpensePage = (req, res, next) => {
    const filePath = path.join(__dirname, '../expense.html');
    res.sendFile(filePath);
}

exports.getAllExpense = async (req, res, next) => {
    try {
        const posts = await userExpense.findAll();
        console.log(posts);
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

exports.postExpense = async (req, res, next) => {
    const { amount, description, category } = req.body;

    try {
        const user = await userExpense.create({
            amount,
            description,
            category
        });
        console.log(user);

        res.json(user);
    } catch (error) {
        console.error('Error uploading post:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

