// ? express-validator npm package donwload

import {
	body,
	param,
	query,
	validationResult,
} from "express-validator";

export const validate = (validations) => {
	return async (req, res, next) => {
		//run all validation
		// this runs 0and store the result in validationResult
		await Promise.all(validations.map(validation.run(req)));

		const errors = validationResult(req);

		if (errors.isEmpty()) {
			return next();
		}

		const extractedError = errors.array().map((err) => ({
			field: err.path,
			message: err.msg,
		}));

		throw new ApiError(
			"validation error",
			400,
			extractedError
		);
	};
};

export const commonValdation = {
	pagination: [
		query("page")
			.optional()
			.isInt({ min: 1 })
			.withMessage("page must be a positive integer"),

		query("limit")
			.optional()
			.isInt({ min: 1, max: 100 })
			.withMessage("page must be a btwn 1 - 100 integer"),
	],

	email: body("email")
		.isEmail()
		.normalizeEmail()
		.withMessage("PLease provide a valid email "),

	name: body("name")
		.trim()
		.isLength({ min: 2, max: 100 })
		.withMessage("PLease provide a valid name "),
};

export const validateSignUp = validate([
	commonValdation.email,
	commonValdation.name,
]);

// todo Validation

// * This code is part of a Node.js backend that uses the express-validator library to validate incoming request data, like query parameters, request body, etc. Here's a simplified explanation:

// ?1. Purpose of the Code
// ? The code is validating user input (like email, name, or pagination parameters) to ensure they meet certain rules before processing them further.

// ? 2. Key Functions and How They Work
// * validate Function
// ? What it does:
// * This is a reusable function that runs all the validation rules you specify for a route.
// * How it works:
// ?It runs all the validation rules you pass to it using validation.run(req).
// ? It collects the results of the validation in validationResult(req).
// ? If there are errors, it creates an array of error messages (extractedError) and throws a custom error (ApiError).
// ? If there are no errors, it moves to the next middleware or route handler using next().
// * commonValidation
// ? This is a collection of commonly used validation rules for things like pagination, email, and name.

// * Pagination Rules:

// query("page"):
// * Validates that the page query parameter is a positive integer if it exists.
// query("limit"):
// * Validates that the limit query parameter is an integer between 1 and 100 if it exists.
// Email Rule:

// body("email"):
// * Checks if the email field in the request body is a valid email address and normalizes it (converts it to a consistent format).
// Name Rule:

// body("name"):
// * Ensures the name field in the request body:
// Has no extra spaces.
// Is between 2 and 100 characters long.
// validateSignUp
// * This combines some of the validation rules from commonValidation for a sign-up route.

// What it does:
// It ensures that:
// The email field is valid.
// The name field is valid
