import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

import hpp from "hpp";
import cookieParser from "cookie-parser";
import cors from "cors";
import MongoSanitize from "express-mongo-sanitize";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import razorpayRoute from "./routes/razorpay.route.js";
import healthRoute from "./routes/health.route.js";
import connectDB, { getDBStatus } from "./database/db.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// * express reads from top to bottom so we use app.use for middleware in express wisely

// todo Express-Rate-Limiter
// ? it is used to limit the number of requests that can be made to a server.
connectDB();
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
});
app.get("/api/v1/db-status", (req, res) => {
	const status = getDBStatus();
	console.log("db status is", status);
	res.status(200).json(status);
});

app.use(helmet());
app.use("/api", limiter);
app.use(express.json({ limit: "10kb" }));
app.use(
	express.urlencoded({ extended: true, limit: "10kb" })
);
app.use(hpp());
// app.use((req, res, next) => {
// 	req.query = { ...req.query }; // Create a shallow copy of req.query
// 	next();
// });
// app.use(
// 	MongoSanitize({
// 		replaceWith: "_", // Replace illegal characters with underscores
// 		allowDots: true,
// 	})
// );

// todo Morgan
// ? see definition.txt file here.

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// todo body parser middleware
// ? by using this we can make sure no body exceed the limit of sending the data to server and also
// ? attacker to avoid sending bulk data to seerver to protect it

app.use(cookieParser());

// todo global error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({
		status: "error",
		message: err.message || "internal server error",
		...(process.env.NODE_ENV === "development" && {
			stack: err.stack,
		}),
	});
});

// todo cors handler

app.use(
	cors({
		origin:
			process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
		methods: [
			"GET",
			"POST",
			"PUT",
			"DELETE",
			"PATCH",
			"HEAD",
			"OPTIONS",
		],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"X-Requested-With",
			"device-remember-token",
			"Access-Control-Allow-Origin",
			"Origin",
			"Accept",
		],
	})
);

// todo api routes
// localhost:8000/api/v1/user
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use("/api/v1/razorpay", razorpayRoute);
app.use("/health", healthRoute);

// ? it should be at the bottom as it always accept teh request and never go to the controllers
// * 404 handler
// todo we use app.use for middleware in express
app.use((req, res) => {
	res.status(404).json({
		status: "error",
		message: "route not found",
	});
});

app.listen(PORT, () => {
	console.log(
		`server is running on port ${PORT} at ${process.env.NODE_ENV} mode `
	);
});
