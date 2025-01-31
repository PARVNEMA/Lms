import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema({
	lecture: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Lecture",
		required: [true, "lecture reference is required"],
	},

	isCompleted: {
		type: Boolean,
		default: false,
	},
	watchTime: {
		type: Number,
		default: 0,
	},
	lastWatched: {
		type: Date,
		default: Date.now,
	},
});

const CourseProgressSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "user reference is required"],
		},
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: [true, "Course reference is required"],
		},

		isCompleted: {
			type: Boolean,
			default: false,
		},
		completionPercentage: {
			type: Number,
			default: 0,
			min: 0,
			max: 100,
		},

		lectureProgress: [lectureProgressSchema],
		lastAccesses: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

//update last accesses
CourseProgressSchema.methods.updateLastAccessed =
	function () {
		this.lastAccessed = Date.now();
		return this.save({ ValidateBeforeSave: false });
	};

//calculate course completion

CourseProgressSchema.pre("save", function (next) {
	if (this.lectureProgress.length > 0) {
		const completedlectures = this.lectureProgress.filter(
			(lp) => lp.isCompleted
		).length;

		this.completionPercentage = Math.round(
			(completedlectures / this.lectureProgress.length) *
				100
		);
		this.isCompleted = this.completionPercentage === 100;
	}
	next();
});

export const CourseProgress = mongoose.model(
	"CourseProgress",
	CourseProgressSchema
);
