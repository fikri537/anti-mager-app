import { db } from "../config/db.js";

export const getTasks = async (req, res) => {
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
};

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, deadline } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ error: "Title & deadline required" });
    }

    await db.query(
      "INSERT INTO tasks (title, deadline, status, penalty, user_id) VALUES (?, ?, 'pending', 0, ?)",
      [title, deadline, userId]
    );

    res.json({ message: "Task created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: "Status required" });
    }

    await db.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
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
};