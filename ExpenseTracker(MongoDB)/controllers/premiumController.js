//controllers/premiumController.js
const instance = require('../config/razorpay');
const Order = require('../models/orderModel');
const User = require('../models/userModel');

exports.createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const amount = 26000;

        const order = await instance.orders.create({ amount: amount });

        const newOrder = await Order.create({
            orderId: order.id,
            amount: amount,
            status: 'Pending',
            userId: userId
        });

        return res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ Error: 'Error creating order' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findOne({ orderId: orderId });

        if (order) {
            order.status = 'Successful';
            await order.save();
        } else {
            return res.status(404).json({ Error: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({ Error: 'Error updating order status' });
    }
};

exports.updatePremiumStatus = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (user) {
            user.isPremium = true;
            await user.save();
            return res.status(201).json({ Message: 'Premium status updated successfully in DB' });
        } else {
            return res.status(400).json({ Error: 'User not found to Update Premium Status' });
        }
    } catch (error) {
        console.error("Error updating premium status:", error);
        return res.status(500).json({ Error: 'Error updating premiumStatus in DB' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({}, { name: 1, totalAmount: 1 }).sort({ totalAmount: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error displaying users in leaderboard:", error);
        return res.status(500).json({ Error: 'Error Displaying Users in leaderboard' });
    }
};


