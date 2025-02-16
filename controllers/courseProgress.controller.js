import { CourseProgress } from "../models/course.progress.js";
import { Course } from "../models/course.model.js";
import {
	ApiError,
	catchAsync,
} from "../middleware/error.middleware.js";
import { sendResponse } from "../utils/responsehandler.js";

/**
 * Get user's progress for a specific course
 * @route GET /api/v1/progress/:courseId
 */
export const getUserCourseProgress = catchAsync(
	async (req, res) => {
		// TODO: Implement get user's course progress functionality
		const { courseId } = req.params;
		const course = await Course.findById(courseId);
		if (!course) {
			throw new ApiError("course not found", 404);
		}

		const courseProgress = await CourseProgress.findOne({
			$and: [{ course: courseId }, { user: req.id }],
		});

		if (!courseProgress) {
			throw new ApiError("course progress not found", 404);
		}

		return sendResponse(
			res,
			200,
			true,
			"course progresss found",
			courseProgress
		);
	}
);

/**
 * Update progress for a specific lecture
 * @route PATCH /api/v1/progress/:courseId/lectures/:lectureId
 */
export const updateLectureProgress = catchAsync(
	async (req, res) => {
		// TODO: Implement update lecture progress functionality
		const { courseId, lectureId } = req.params;
	}
);

/**
 * Mark entire course as completed
 * @route PATCH /api/v1/progress/:courseId/complete
 */
export const markCourseAsCompleted = catchAsync(
	async (req, res) => {
		// TODO: Implement mark course as completed functionality
	}
);

/**
 * Reset course progress
 * @route PATCH /api/v1/progress/:courseId/reset
 */
export const resetCourseProgress = catchAsync(
	async (req, res) => {
		// TODO: Implement reset course progress functionality
		const { courseId } = req.params;
	}
);
