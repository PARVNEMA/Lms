import Razorpay from "razorpay";
import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursepurchase.model.js";
import crypto from "crypto";
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
	try {
		const userId = req.id;
		const { courseId } = req.body;

		const course = await Course.findById(courseId);
		if (!course) {
			return res
				.status(404)
				.json({ message: "course not found" });
		}

		const newPurchase = new CoursePurchase({
			course: courseId,
			user: userId,
			amount: course.price,
			status: "pending",
		});

		const options = {
			amount: course.price * 100,
			currency: "INR",
			receipt: `course_${courseId}`,
			notes: {
				courseId: courseId,
				userId: userId,
			},
		};

		const order = await razorpay.orders.create(options);

		console.log("order", order);

		newPurchase.paymentId = order.id;
		await newPurchase.save();

		res.status(200).json({
			success: true,
			order,
			course: {
				name: course.title,
				desc: course.description,
			},
		});
	} catch (error) {
		console.log(error);
		throw new ApiError(
			"something went wrong in doing purchase",
			500
		);
	}
};

export const verifyPayment = async (req, res) => {
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
		} = req.body;

		const body =
			razorpay_order_id + "|" + razorpay_payment_id;

		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(body.toString())
			.digest("hex");

		const isAuthentic =
			expectedSignature === razorpay_signature;

		if (!isAuthentic) {
			throw new ApiError("invalid signature", 400);
		}

		const purchase = await CoursePurchase.findOne({
			paymentId: razorpay_order_id,
		});
		if (!purchase) {
			return res
				.status(404)
				.json({ message: "purchase recored nor found" });
		}

		purchase.status = "completed";
		await purchase.save();

		res.status(200).json({
			success: true,
			message: "payment verified successfully",
			courseId: purchase.courseId,
		});
	} catch (error) {
		console.log(error);
		throw new ApiError(
			"something went wrong in verifying purchase",
			500
		);
	}
};
