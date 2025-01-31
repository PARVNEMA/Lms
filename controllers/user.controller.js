import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";
import { User } from "../models/user.model.js";
import {
	deleteMediaFromCloudinary,
	uploadMedia,
} from "../utils/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";

export const createUserAccount = catchAsync(
	async (req, res) => {
		const {
			name,
			email,
			password,
			role = "student",
		} = req.body;

		// we will do validaitons globally

		const existingUser = await User.findOne({
			email: email.toLowerCase(),
		});

		if (existingUser) {
			throw new ApiError("user already exists", 400);
		}

		const user = await User.create({
			name,
			email: email.toLowerCase(),
			password,
			role,
		});

		await user.updateLastActive();
		generateToken(res, user, "account created hogya");
	}
);

export const authenticateUser = catchAsync(
	async (req, res) => {
		const { email, password } = req.body;

		// we will do validaitons globally

		const existingUser = await User.findOne({
			email: email.toLowerCase(),
		}).select("+password");

		if (!existingUser) {
			throw new ApiError("user not exists", 400);
		}

		if (!(await existingUser.comparePassword(password))) {
			throw new ApiError("invalid  password", 401);
		}

		await existingUser.updateLastActive();
		generateToken(
			res,
			existingUser,
			`welcome back ${existingUser.name} Chacha 💸💸👌👌`
		);
	}
);

export const SignoutUser = catchAsync(async (_, res) => {
	res.cookie("token", "", { maxAge: 0 });

	res.status(200).json({
		success: true,
		message: "signed out successfully 🥲🥲",
	});
});

export const getCurrentUserProfile = catchAsync(
	async (req, res) => {
		const user = await User.findById(req.id).populate({
			path: "enrolledCourses.course",
			select: "title thumbnail description",
		});

		if (!user) {
			throw new ApiError("user not found", 404);
		}

		res.status(200).json({
			success: true,
			data: {
				...user.toJSON,
				totalenrolledcourses: user.totalenrolledcourses,
			},
		});
	}
);
export const updateUserProfile = catchAsync(
	async (req, res) => {
		const { name, email, bio } = req.body;
		const updateData = {
			name,
			email: email?.toLowerCase(),
			bio,
		};
		if (req.file) {
			const avatarResult = await uploadMedia(req.file.path);
			updateData.avatar = avatarResult.secure_url;

			//delete old avatar
			const user = await User.findById(req.id);
			if (
				user.avatar &&
				user.avatar !== 'default-avatar.png"'
			) {
				await deleteMediaFromCloudinary(user.avatar);
			}
		}
		// update the user and get updated docs

		const updateduser = await User.findByIdAndUpdate(
			req.id,
			updateData,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updateduser) {
			throw new ApiError("user not found", 404);
		}

		res.status(200).json({
			success: true,
			message: "profile updated successfully",
			data: updateduser,
		});
	}
);
