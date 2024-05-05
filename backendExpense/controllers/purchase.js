
const Razorpay = require('razorpay');
const Order = require('../models/orders')
require("dotenv").config();
const userController = require('./users')
const User = require('../models/users');


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

// exports.updateTransactionStatus = async (req, res) => {
//     try {
//         const { payment_id, order_id } = req.body;

//         await Order.update(
//             {
//                 paymentId: payment_id,
//                 status: "successfull",
//             },
//             {
//                 where: { orderid: order_id },
//             }
//         );

//         const userid = req.user.id;
//         console.log(userid);

//         await User.update({ ispremiumuser: true }, { where: { id: userid } });

//         res.status(202).json({ success: true, message: "transaction successfull" });
//     } catch (err) {
//         res.status(400).json({ success: false, message: "an error occured" });

//     }
// };

exports.updateTransactionStatus = async (req, res) => {
    try {
        const id = req.user;
        const { paymentId, orderId } = req.body;
        const orderDetails = await Order.findOne({ where: { id: orderId } });
        if (!orderDetails) return res.status(504).json("Server Error");
        await orderDetails.update({ paymentId, status: "SUCCESSFUL" });
        const userDetails = await User.findByPk(id);
        const result = await userDetails.update({ ispremiumuser: true });
        console.log("Order Updated Successfully");
        res.status(200).json("Order Updated Successfully");
    } catch (err) {
        res.status(500).json(err);
    }
};