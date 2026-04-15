import express from "express";
import { db } from "../config/db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline ASC",
      [userId]
    );

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, deadline } = req.body;

    await db.query(
      "INSERT INTO tasks (title, deadline, status, penalty, user_id) VALUES (?, ?, 'pending', 0, ?)",
      [title, deadline, userId]
    );

    res.json({ message: "Task created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        users.id,
        users.name,
        COALESCE(SUM(
          CASE 
            WHEN tasks.status = 'done' THEN 10
            WHEN tasks.status = 'late' THEN -5
            ELSE 0
          END
        ), 0) AS score
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