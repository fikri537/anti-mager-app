import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getTasks,
  createTask,
  updateTask,
  getLeaderboard,
} from "../controllers/taskcontroller.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);

router.get("/leaderboard", getLeaderboard);

export default router;