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
		}).populate("lectureProgress.lecture");

		if (!courseProgress) {
			throw new ApiError("course progress not found", 404);
		}

		const lectures = courseProgress.lectureProgress;
		const lectureprogress = lectures.filter(
			(lec) => lec.isCompleted === true
		);

		const completedLectures = Math.round(
			(lectureprogress.length / lectures.length) * 100
		);

		return res.status(200).json({
			success: true,
			data: {
				courseProgress,
				compltedLectures: completedLectures,
				getCompletedLectures: lectureprogress,
			},
		});
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
		const courseProgressExists =
			await CourseProgress.findOne({
				$and: [{ course: courseId }, { user: req.id }],
			});
		if (!courseProgressExists) {
			throw new ApiError(400, "course is not purchased");
		}
		const lectureIndex =
			await courseProgressExists.lectureProgress.findIndex(
				(lectures) =>
					lectures.lecture.toString() === lectureId
			);

		if (lectureIndex !== -1) {
			courseProgressExists.lectureProgress[
				lectureIndex
			].isCompleted = true;
		} else {
			courseProgressExists.lectureProgress.push({
				lecture: lectureId,
				isCompleted: true,
			});
		}

		const course = await Course.findById(courseId);
		const completedlectures =
			courseProgressExists.lectureProgress.filter(
				(lec) => lec.isCompleted === true
			);
		courseProgressExists.isCompleted =
			completedlectures.length === course.lectures.length;

		courseProgressExists.completionPercentage =
			Math.round(
				completedlectures.length / course.lectures.length
			) * 100;
		await courseProgressExists.save();

		return res.status(200).json({
			success: true,
			data: {
				lectureProgress:
					courseProgressExists.lectureProgress,
				lecturescompleted: completedlectures.length,
			},
		});
	}
);

/**
 * Mark entire course as completed
 * @route PATCH /api/v1/progress/:courseId/complete
 */
export const markCourseAsCompleted = catchAsync(
	async (req, res) => {
		// TODO: Implement mark course as completed functionality
		const { courseId } = req.params;
		const course = await Course.findById(courseId);
		if (!course) {
			throw new ApiError("course not found", 404);
		}

		const courseProgress = await CourseProgress.findOne({
			$and: [{ course: courseId }, { user: req.id }],
		}).populate("lectureProgress.lecture");

		if (!courseProgress) {
			return res.status(200).json({
				success: true,
				message: "course progress empty",
			});
		}

		courseProgress.isCompleted = true;
		await courseProgress.save();

		return sendResponse(
			res,
			200,
			true,
			"Course Marked Complted ✅✅"
		);
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
		const course = await Course.findById(courseId);
		if (!course) {
			throw new ApiError("course not found", 404);
		}

		const courseProgress = await CourseProgress.findOne({
			$and: [{ course: courseId }, { user: req.id }],
		}).populate("lectureProgress.lecture");

		if (!courseProgress) {
			return res.status(200).json({
				success: true,
				message: "course progress empty",
			});
		}
		courseProgress.isCompleted = false;
		courseProgress.lectureProgress = [];
		await courseProgress.save();

		return sendResponse(
			res,
			200,
			true,
			"Course progress reset"
		);
	}
);
