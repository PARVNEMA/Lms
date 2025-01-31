import jwt from "jsonwebtoken";
import {
	ApiError,
	catchAsync,
} from "./error.middleware.js";

export const isAuthenticated = catchAsync(
	async (req, res, next) => {
		const token = req.cookies.token;

		if (!token) {
			throw new ApiError("you are not logged in❌❌", 401);
		}

		try {
			const decodedToken = await jwt.verify(
				token,
				process.env.SECRET_KEY
			);
			// ? adding addtional properties to request that we are extracting from the token
			req.id = decodedToken.userId;

			next();
		} catch (error) {
			throw new ApiError("jWT token error", 401);
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
			}
			next();
		} catch (error) {
			// If token is invalid, just continue without authentication
			next();
		}
	}
);
