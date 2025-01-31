// utils/responseHandler.js

export const sendResponse = (
	res,
	statusCode,
	success,
	message,
	data = null,
	error = null
) => {
	return res.status(statusCode).json({
		success,
		message,
		data,
		error,
	});
};
