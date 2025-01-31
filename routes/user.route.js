import { Router } from "express";
import {
	authenticateUser,
	createUserAccount,
	getCurrentUserProfile,
	SignoutUser,
	updateUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";
import { validateSignUp } from "../middleware/validation.middleware.js";

const router = Router();

router.post("/signup", validateSignUp, createUserAccount);
router.post("/signin", authenticateUser);
router.post("/signout", isAuthenticated, SignoutUser);

// Profile routes
router.get(
	"/profile",
	isAuthenticated,
	getCurrentUserProfile
);
router.patch(
	"/profile",
	isAuthenticated,
	upload.single("avatar"),
	updateUserProfile
);
export default router;
