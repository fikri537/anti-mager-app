import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/taskcontroller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTaskStatus);
router.get("/leaderboard", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        users.id,
        users.name,
        SUM(
          CASE 
            WHEN tasks.status = 'done' THEN 10
            WHEN tasks.status = 'late' THEN -5
            ELSE 0
          END
        ) as score
      FROM users
      LEFT JOIN tasks ON users.id = tasks.user_id
      GROUP BY users.id
      ORDER BY score DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;