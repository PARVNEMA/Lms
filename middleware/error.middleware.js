// * we standardize the try and catch so we dont need to add it again and again to every function
// ? see definition.txt
export const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	};
};

export class ApiError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4")
			? "fail"
			: "error";

		this.isOperational = true; //optional

		Error.captureStackTrace(this, this.constructor);
	}
}

// handle JWT error

export const handleJWTError = () => {
	new ApiError(
		"invalid token please loging again 🧑‍🎄🧑‍🎄",
		401
	);
};
