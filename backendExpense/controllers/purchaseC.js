
const Razorpay = require("razorpay")
const Order = require("../models/ordersM")
const userController = require("./usersC")

const purchasepremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500 // in paise

        const order = await rzp.orders.create({ amount, currency: "INR" });

        await req.user.createOrder({ orderid: order.id, status: 'PENDING' })
        return res.status(201).json({ order, key_id: rzp.key_id })

    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err })
    }
}
const updateTransactionStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(userId);
        const { payment_id, order_id } = req.body;
        console.log(payment_id, order_id)
        const order = await Order.findOne({ where: { orderid: order_id } })
        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' })
        const promise2 = req.user.update({ ispremiumuser: true })

        await Promise.all([promise1, promise2]);
        return res.status(202).json({ success: true, message: "Transaction Successful", token: userController.genrateAccessSecretToken(userId, undefined, true) });



    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err, message: 'Something went wrong' })

    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}