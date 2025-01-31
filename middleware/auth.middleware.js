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
