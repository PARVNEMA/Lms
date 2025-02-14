import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import {
	deleteMediaFromCloudinary,
	uploadMedia,
} from "../utils/cloudinary.js";
import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";
import { sendResponse } from "../utils/responsehandler.js";

/**
 * Create a new course
 * @route POST /api/v1/courses
 */
export const createNewCourse = catchAsync(
	async (req, res) => {
		const {
			title,
			subtitle,
			description,
			category,
			level,
			price,
		} = req.body;

		// Handle thumbnail upload
		let thumbnail;
		if (req.file) {
			const result = await uploadMedia(req.file.path);
			thumbnail = result?.secure_url || req.file.path;
		} else {
			throw new ApiError(
				"Course thumbnail is required",
				400
			);
		}

		// Create course
		const course = await Course.create({
			title,
			subtitle,
			description,
			category,
			level,
			price,
			thumbnail,
			instructor: req.id,
		});

		// Add course to instructor's created courses
		await User.findByIdAndUpdate(req.id, {
			$push: { createdCourses: course._id },
		});

		res.status(201).json({
			success: true,
			message: "Course created successfully",
			data: course,
		});
	}
);

/**
 * Search courses with filters
 * @route GET /api/v1/courses/search
 */
export const searchCourses = catchAsync(
	async (req, res) => {
		try {
			const { term } = req.query;
			console.log("query=", term);

			if (!term) {
				return sendResponse(
					res,
					400,
					false,
					"Search term is required"
				);
			}

			// Search using regex (case-insensitive, partial match)
			const courses = await Course.find({
				$or: [
					{ title: { $regex: term, $options: "i" } },
					{ description: { $regex: term, $options: "i" } },
					{ tags: { $in: [new RegExp(term, "i")] } },
				],
			}).limit(10); // Apply a limit for performance

			if (!courses.length) {
				return sendResponse(
					res,
					404,
					false,
					"No courses found"
				);
			}

			sendResponse(
				res,
				200,
				true,
				"Courses found successfully",
				courses
			);
		} catch (error) {
			console.error("Error searching courses:", error);
			sendResponse(
				res,
				500,
				false,
				"Internal Server Error"
			);
		}
	}
);

/**
 * Get all published courses
 * @route GET /api/v1/courses/published
 */
export const getPublishedCourses = catchAsync(
	async (req, res) => {
		// TODO: Implement get published courses functionality

		const allCourses = await Course.find({
			isPublished: true,
		});
		if (!allCourses) {
			sendResponse(
				res,
				404,
				true,
				"no Published Course Found"
			);
		}

		sendResponse(
			res,
			200,
			true,
			"Course Found",
			allCourses
		);
	}
);

/**
 * Get courses created by the current user
 * @route GET /api/v1/courses/my-courses
 */
export const getMyCreatedCourses = catchAsync(
	async (req, res) => {
		// TODO: Implement get my created courses functionality
		const myCreatedCourse = await Course.find({
			instructor: req.id,
		});

		if (!myCreatedCourse) {
			return res.status(404).json({
				success: false,
				message: "no Published Course Found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "all Published courses Found",
			data: myCreatedCourse,
		});
	}
);

/**
 * Update course details
 * @route PATCH /api/v1/courses/:courseId
 */
export const updateCourseDetails = catchAsync(
	async (req, res) => {
		// TODO: Implement update course details functionality
	}
);

/**
 * Get course by ID
 * @route GET /api/v1/courses/:courseId
 */
export const getCourseDetails = catchAsync(
	async (req, res) => {
		// TODO: Implement get course details functionality
	}
);

/**
 * Add lecture to course
 * @route POST /api/v1/courses/:courseId/lectures
 */
export const addLectureToCourse = catchAsync(
	async (req, res) => {
		// TODO: Implement add lecture to course functionality
	}
);

/**
 * Get course lectures
 * @route GET /api/v1/courses/:courseId/lectures
 */
export const getCourseLectures = catchAsync(
	async (req, res) => {
		// TODO: Implement get course lectures functionality
	}
);
