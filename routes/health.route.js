import express from "express";
import { checkHealth } from "../controllers/health.controller.js";
// *add.js to avoid error

const router = express.Router();

router.get("/", checkHealth);

export default router;
