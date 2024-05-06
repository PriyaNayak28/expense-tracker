
const Razorpay = require('razorpay');
const Order = require('../models/orders')
require("dotenv").config();
const userController = require('./users')
const User = require('../models/users');
const jwt = require('jsonwebtoken');


exports.purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({
                orderid: order.id,
                status: 'PENDING',
                UserId: req.user,
            }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id, amount });

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err })
    }
}

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id, userId } = req.body;

        await Order.update(
            {
                paymentid: payment_id,
                status: "successfull",
            },
            {
                where: { orderid: order_id },
            }
        );

        const userid = req.user.id;
        console.log(userid);

        await User.update({ ispremiumuser: true }, { where: { id: userid } });

        res.status(202).json({ success: true, message: "transaction successfull" });
    } catch (err) {
        res.status(400).json({ success: false, message: "an error occured" });

    }
};


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
