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
		try {
			console.log("Decoded User:", req.user);

			const {
				title,
				subtitle,
				description,
				category,
				level,
				price,
			} = req.body;

			console.log("Received request body:", req.body);
			console.log("Received file:", req.file);

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

			console.log("Saving course to database...");
			const course = await Course.create({
				title: "fvdvf",
				subtitle: "fdff",
				description: "rr",
				category: "web development",
				level: "begginer",
				price: 0,
				instructor: "67a068713712f6c1c1d53637",
				thumbnail: "xyz",
			});
			console.log("Course created:", course);

			if (!course) {
				throw new ApiError(
					"Some error while creating course",
					500
				);
			}

			console.log("Sending response...");
			res.status(201).json({
				success: true,
				message: "Course created successfully",
				data: course,
			});
		} catch (error) {
			console.log("error in course creation", error);
		}
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
