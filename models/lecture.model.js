import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "title is required"],
			trim: true,
			maxLength: [
				100,
				"course title cannot exceed 100 characters",
			],
		},
		description: {
			type: String,
			trim: true,
			maxLength: [
				600,
				"lecture desc cannot exceed 200 characters",
			],
		},

		videoUrl: {
			type: String,
			required: [true, "video url is required"],
		},
		duration: {
			type: Number,
			default: 0,
		},
		publicId: {
			type: String,
			required: [
				true,
				"public id is required for video management",
			],
		},

		isPreview: {
			type: Boolean,
			default: true,
		},
		order: {
			type: Number,
			required: [true, "lecture order is required"],
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

lectureSchema.pre("save", function (next) {
	if (this.duration) {
		this.duration = Math.round(this.duration * 100) / 100; // optional thing of roundingoff lecture
	}
	next();
});

export const Lecture = mongoose.model(
	"Lecture",
	lectureSchema
);
