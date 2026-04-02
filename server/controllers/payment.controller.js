import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto"



export const createOrder = async (req, res) => {
    try {
        const { planId, amount, credits } = req.body;
        if (!amount || !credits) {
            return res.status(400).json({ message: "Invalid plan data" });
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options)

        await Payment.create({
            userId: req.userId,
            planId,
            amount,
            credits,
            razorpayOrderId: order.id,
            status: "created",
        })

        return res.json(order);

    } catch (error) {
        return res.status(500).json({ message: `Failed to create razorpay order ${error}` });
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        const payment = await Payment.findOne({
            razorpayOrderId: razorpay_order_id,
        })

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        //update Payment record 
        payment.status = "paid";
        payment.razorpayPaymentId = razorpay_payment_id;
        await payment.save();

        //add credits to user 
        const updatedUser = await User.findByIdAndUpdate(payment.userId, {
            $inc: { credits: payment.credits },
        }, { new: true })

        return res.json({
            sucess: true,
            message: "Payment verified and Credits added",
            user: updatedUser,
        });

    } catch (error) {
        return res.status(500).json({ message: `Failed to verify Razorpay payment ${error}` });
    }
}