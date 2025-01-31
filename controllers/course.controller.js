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
		// TODO: Implement create new course functionality

		const {
			title,
			subtitle,
			description,
			category,
			level,
			price,
		} = req.body;
		const uploadData = {
			title,
			subtitle,
			description,
			category,
			level,
			price,
		};
		if (req.file) {
			const thumbnailr = await uploadMedia(req.file.path);
			uploadData.thumbnail = thumbnailr.secure_url;
		}

		const course = await Course.create(uploadData);

		if (!course) {
			throw new ApiError(
				"some Error while Creating Course ",
				500
			);
		}

		sendResponse(
			res,
			201,
			true,
			"Course Created Successfully",
			course
		);
	}
);

/**
 * Search courses with filters
 * @route GET /api/v1/courses/search
 */
export const searchCourses = catchAsync(
	async (req, res) => {
		// TODO: Implement search courses functionality
	}
);

/**
 * Get all published courses
 * @route GET /api/v1/courses/published
 */
export const getPublishedCourses = catchAsync(
	async (req, res) => {
		// TODO: Implement get published courses functionality
	}
);

/**
 * Get courses created by the current user
 * @route GET /api/v1/courses/my-courses
 */
export const getMyCreatedCourses = catchAsync(
	async (req, res) => {
		// TODO: Implement get my created courses functionality
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
