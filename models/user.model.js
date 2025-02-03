import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { type } from "os";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "name is required"],
			trim: true,
			maxLength: [
				50,
				"name must be less than 50 characters",
			],
		},
		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"please provide a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "password is required"],
			minLength: [6, "minlength should be 6"],
			select: false, // *password will not automatically selected and sent when we query the database select(-password)
		},

		role: {
			type: String,
			enum: {
				values: ["student", "admin", "instructor"],
				message: "please select a vald role",
			},
			default: "student",
		},

		avatar: {
			type: String,
			default: "default-avatar.png",
		},

		bio: {
			type: String,
			maxLength: [
				200,
				"bio must be less than 200 characters",
			],
		},
		enrolledCourses: [
			{
				course: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Course",
				},
				enrolledAt: {
					type: Date,
					default: Date.now,
				},
			},
		],

		createdCourses: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Course",
			},
		],

		resetPasswordToken: String,
		resetPasswordTokenExpiry: Date,

		lastActive: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// * ismodified checks if the password field is changed or not and it also returns true on first time saving the password

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// todo compare password
userSchema.methods.comparePassword = async function (
	enteredPassword
) {
	return await bcrypt.compare(
		enteredPassword,
		this.password
	);
};
userSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(10).toString("hex");

	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.resetPasswordTokenExpiry =
		Date.now() + 10 * 60 * 1000;

	return resetToken;
};

// * see virtuals definition  from definition.txt file

// virtual field for total enrolled courses

userSchema.virtual("totalenrolledcourses").get(function () {
	return this.enrolledCourses.length;
});

userSchema.methods.updateLastActive = function () {
	this.lastActive = Date.now();
	return this.save({ validateBeforeSave: false });
};

export const User = mongoose.model("User", userSchema);
