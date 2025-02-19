import jwt from "jsonwebtoken";
import {
	ApiError,
	catchAsync,
} from "./error.middleware.js";

import { User } from "../models/user.model.js";

export const isAuthenticated = catchAsync(
	async (req, res, next) => {
		const token =
			req.cookies.token ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			throw new ApiError("you are not logged in❌❌", 401);
		}

		try {
			const decodedToken = await jwt.verify(
				token,
				process.env.JWT_SECRET
			);
			// ? adding addtional properties to request that we are extracting from the token
			req.id = decodedToken.userId;

			const user = await User.findById(req.id);
			if (!user) {
				throw new ApiError("user not found", 404);
			}
			req.user = user;
			next();
		} catch (error) {
			if (error.name === "JsonWebTokenError") {
				throw new ApiError(
					"Invalid token. Please log in again.",
					401
				);
			}
			if (error.name === "TokenExpiredError") {
				throw new ApiError(
					"Your token has expired. Please log in again.",
					401
				);
			}
			throw error;
		}
	}
);

export const restrictTo = (...roles) => {
	return catchAsync(async (req, res, next) => {
		// roles is an array ['admin', 'instructor']
		if (!roles.includes(req.user.role)) {
			throw new ApiError(
				"You do not have permission to perform this action",
				403
			);
		}
		next();
	});
};

// Optional authentication middleware
export const optionalAuth = catchAsync(
	async (req, res, next) => {
		try {
			const token = req.cookies.token;
			if (token) {
				const decoded = await jwt.verify(
					token,
					process.env.JWT_SECRET
				);
				req.id = decoded.userId;
				req.role = decoded.role;
			}
			next();
		} catch (error) {
			// If token is invalid, just continue without authentication
			next();
		}
	}
);
