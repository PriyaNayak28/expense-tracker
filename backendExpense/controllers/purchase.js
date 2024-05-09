
// const Razorpay = require('razorpay');
// const Order = require('../models/orders')
// require("dotenv").config();
// const userController = require('./users')
// const User = require('../models/users');
// const jwt = require('jsonwebtoken');


// exports.purchasepremium = async (req, res) => {
//     try {
//         var rzp = new Razorpay({
//             key_id: process.env.RAZORPAY_KEY_ID,
//             key_secret: process.env.RAZORPAY_KEY_SECRET
//         })
//         const amount = 2500;

//         rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
//             if (err) {
//                 throw new Error(JSON.stringify(err));
//             }
//             req.user.createOrder({
//                 orderid: order.id,
//                 status: 'PENDING',
//                 UserId: req.user,
//             }).then(() => {
//                 return res.status(201).json({ order, key_id: rzp.key_id, amount });

//             }).catch(err => {
//                 throw new Error(err)
//             })
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(403).json({ message: 'Sometghing went wrong', error: err })
//     }
// }


// exports.updateTransactionStatus = async (req, res) => {
//     try {
//         console.log("in updateTransactionStatus");
//         const { payment_id, order_id, userId } = req.body;
//         console.log(userId, "jo bbhi ho")

//         console.log("payment_id:", payment_id);
//         console.log("order_id:", order_id);


//         const [order, user] = await Promise.all([
//             Order.findOne({ where: { orderid: order_id } }),
//             req.user, User.findByPk(userId),
//         ]);

//         console.log("order:", order);
//         console.log("user:", user);

//         if (!order || !user) {
//             console.error("Order or user not found");
//             return res.status(404).json({ success: false, message: "Order or user not found" });
//         }

//         await Promise.all([
//             order.update({ paymentid: payment_id, status: 'SUCCESSFULL', userId: userId }),
//             user.update({ ispremiumuser: true })
//         ]);

//         const updatedToken = jwt.sign({
//             userId: User.id,
//             name: User.userName,
//             ispremiumuser: User.ispremiumuser,
//             iat: Math.floor(Date.now() / 1000),
//         }, process.env.TOKEN_SECRET);
//         req.user.token = updatedToken;
//         //  console.log("udateToken", updatedToken)

//         console.log("newtoken in update transaction", updatedToken);
//         return res.status(200).json({ success: true, message: "Transaction Successfull!", token: updatedToken });
//         console.log("Transaction updated successfully");
//     } catch (err) {
//         console.error("Error in updateTransactionStatus:", err);
//         return res.status(500).json({ success: false, message: "Server Error" });
//     }
// };


const Razorpay = require('razorpay');
// const { req, res } = require('express');
const Order = require('../models/orders');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const userController = require('../controllers/users');

const purchasepremium = async (req, res) => {
    console.log("#in purchase premium ");
    const token = req.header('Authorization');
    console.log("#token in purschase premium:", token);
    // Check if the token is present
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token missing.' });
    }

    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        // Obtain token from request headers

        console.log("#values if configured");

        const amount = 4000;

        rzp.orders.create({ // Ensure correct function call
            amount,
            currency: "INR",
        }, async (error, order) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: "error creating order" });
            }
            console.log("#order yaha:", order);

            try {
                await Order.create({
                    orderid: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    status: "PENDING",
                    userId: req.user.id,
                });
                console.log("#useridinpurchace", Order.userId);
                const updatedUser = await User.update(
                    { ispremiumuser: true },
                    { where: { id: req.user.id } }
                );

                console.log(updatedUser, "#updatauserE")
                console.log('#', req.user.id);
                console.log('#', req.user.userName);
                const newToken = jwt.sign(
                    {
                        userId: req.user.id,
                        userName: req.user.userName,
                        ispremiumuser: true,
                        iat: Math.floor(Date.now() / 1000),
                    },
                    process.env.TOKEN_SECRET
                );
                console.log('##', newToken.userId)
                console.log('##', newToken.userName)
                return res.status(201).json({ order, key_id: rzp.key_id, token: newToken });
            } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "#error saving order details" });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "#error proccesing purchase", err });
    }
};


const updateTransactionStatus = async (req, res) => {
    try {
        console.log("#in updateTransactionStatus");
        const { payment_id, order_id, userId } = req.body;


        console.log("#payment_id:", payment_id);
        console.log("#order_id:", order_id);
        console.log("#userid", userId);


        const [order, user] = await Promise.all([
            Order.findOne({ where: { orderid: order_id } }),
            req.user, User.findByPk(userId),
        ]);

        console.log("#order:", order);
        console.log("#user:", user);

        if (!order || !user) {
            console.error("#Order or user not found");
            return res.status(404).json({ success: false, message: "#Order or user not found" });
        }

        await Promise.all([
            order.update({ paymentid: payment_id, status: 'SUCCESSFULL', userId: userId }),
            user.update({ ispremiumuser: true })
        ]);

        const updatedToken = jwt.sign({
            newUserId: user.id,
            userName: user.userName,
            ispremiumuser: user.ispremiumuser,
            iat: Math.floor(Date.now() / 1000),
        }, process.env.TOKEN_SECRET);
        req.user.token = updatedToken;
        console.log("req.user.token", req.user.token);
        console.log("utui", updatedToken.newUserId);
        console.log("utn", updatedToken.userName);

        console.log("#newtoken in update transaction", updatedToken);
        return res.status(200).json({ success: true, message: "Transaction Successfull!", token: updatedToken });
        console.log("#Transaction updated successfully");
    } catch (err) {
        console.error("#Error in updateTransactionStatus:", err);
        return res.status(500).json({ success: false, message: "#Server Error" });
    }
};

module.exports = { purchasepremium, updateTransactionStatus };

