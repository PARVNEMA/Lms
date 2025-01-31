import mongoose from "mongoose";

const CoursePurchaseSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "user reference is required"],
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: [true, "Course reference is required"],
		},

		amount: {
			type: Number,
			required: [true, "purchase amount is required"],
			min: [0, "amount must be non negative"],
		},
		currency: {
			type: String,
			required: [true, "Currency is required"],
			min: [0, "amount must be non negative"],
		},

		status: {
			type: String,
			enum: {
				values: [
					"pending",
					"completed",
					"failure",
					"refunded",
				],
				message: "please select a valid status",
			},
			default: "pending",
		},

		paymentMethod: {
			type: String,
			required: [true, "payment method is required"],
		},
		paymentId: {
			type: String,
			required: [true, "payment ID is required"],
		},
		refundId: {
			type: String,
			required: [true, "refundId is required"],
		},
		refundAmount: {
			type: Number,
			min: [0, "refund amount must be non negative"],
		},
		refundReason: {
			type: String,
		},
		metadata: {
			type: Map,
			of: String,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// see indexing in definition.txt

CoursePurchaseSchema.index({ user: 1, course: 1 });
CoursePurchaseSchema.index({ status: 1 });
CoursePurchaseSchema.index({ createdAt: -1 });

CoursePurchaseSchema.virtual("isRefundable").get(
	function () {
		if (this.status !== "completed") return false;

		const thirtyDaysAgo = new Date(
			Date.now() - 30 * 24 * 60 * 60 * 1000
		);
		return this.createdAt > thirtyDaysAgo;
	}
);

//method to process refund
CoursePurchaseSchema.methods.processRefund =
	async function (reason, amount) {
		this.reason = reason;
		this.status = "refunded";
		this.refundAmount = amount || this.amount;
		return this.save();
	};
export const CoursePurchase = new mongoose.model(
	"CoursePurchase",
	CoursePurchaseSchema
);
