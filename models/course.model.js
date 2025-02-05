import mongoose, { mongo } from "mongoose";

const courseSchema = new mongoose.Schema(
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
		subtitle: {
			type: String,
			trim: true,
			maxLength: [
				200,
				"course subtitle cannot exceed 200 characters",
			],
		},
		description: {
			type: String,
			trim: true,
			maxLength: [
				400,
				"course desc cannot exceed 200 characters",
			],
		},
		category: {
			type: String,
			required: [true, "category is required"],
			trim: true,
		},
		level: {
			type: String,
			enum: {
				values: ["begginer", "intermediate", "advance"],
				message:
					"level must be begginer intermediate or advance",
			},
			default: "begginer",
		},
		price: {
			type: Number,
			required: [true, "price is required"],
			min: [0, "pricce must be positive"],
		},
		thumbnail: {
			type: String,
			required: [true, "thumbnail is required"],
		},
		enrolledStudents: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		lectures: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Lecture",
			},
		],

		instructor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: [true, "instructor is required"],
		},
		isPublished: {
			type: Boolean,
			default: true,
		},
		totalDuration: {
			type: Number,
			default: 0,
		},
		totalLectures: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

courseSchema.virtual("averageRating").get(function () {
	return 0; //placeholder assginment
});
courseSchema.pre("save", function (next) {
	if (this.lecture) {
		return (this.totalLectures = this.lectures.length);
	}
});

export const Course = mongoose.model(
	"Course",
	courseSchema
);
