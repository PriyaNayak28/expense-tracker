
// const Razorpay = require('razorpay');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const User = require('../models/usersM');
// const Order = require('../models/ordersM');
// const userController = require('./usersC');

// // purchase premium controller
// const purchasePremium = async (req, res) => {

//     console.log("purchase controller - purchasePremium ");
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. Token missing.' });
//     }
//     try {
//         const rzp = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET,
//         });
//         console.log("#values if configured");
//         const amount = 2000;
//         rzp.orders.create({
//             amount,
//             currency: "INR",
//         }, async (error, order) => {
//             if (error) {
//                 console.error(error);
//                 return res.status(500).json({ message: "error creating order" });
//             }
//             try {
//                 await Order.create({
//                     orderid: order.id,
//                     amount: order.amount,
//                     currency: order.currency,
//                     status: "PENDING",
//                     userId: req.user.id,
//                 });
//                 const updatedUser = await User.update(
//                     { ispremiumuser: true },
//                     { where: { id: req.user.id } }
//                 );

//                 return res.status(201).json({ order, key_id: rzp.key_id });
//             } catch (err) {
//                 console.log(err);
//                 return res.status(500).json({ message: "#error saving order details" });
//             }
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(403).json({ message: "#error proccesing purchase", err });
//     }

// };

// // const updateTransactionStatus = async (req, res) => {
// //     try {
// //         const { payment_id, order_id } = req.body;
// //         const userId = req.user.id;

// // const [order, user] = await Promise.all([
// //     Order.findOne({ where: { orderid: order_id } }),
// //     req.user, User.findByPk(userId),
// // ]);

// // if (!order || !user) {
// //     console.error("Order or user not found");
// //     return res.status(404).json({ success: false, message: "Order or user not found" });
// // }

// // await Promise.all([
// //     order.update({ paymentid: payment_id, status: 'SUCCESSFULL', newUserId: userId }),
// //     user.update({ ispremiumuser: true })
// //     return res.status(200).json({ success: true, message: "Transaction Successfull!", token: userController.genrateAccessSecretToken(userId, undefined, true) });
// // ]);

// // const updatedToken = jwt.sign({
// //     newUserId: user.id,
// //     userName: user.userName,
// //     ispremiumuser: user.ispremiumuser,
// //     iat: Math.floor(Date.now() / 1000),
// // }, process.env.TOKEN_SECRET);
// // req.user.token = updatedToken;

// // return res.status(200).json({ success: true, message: "Transaction Successfull!", token: userController.genrateAccessSecretToken(userId, undefined, true) });
// // }
// //  catch (err) {
// //     console.error("#Error in updateTransactionStatus:", err);
// //     return res.status(500).json({ success: false, message: "#Server Error" });
// // }
// // };


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