import { db } from "../config/db.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.id;

    await db.query(
      "INSERT INTO tasks (user_id, title, description, deadline) VALUES (?, ?, ?, ?)",
      [userId, title, description, deadline]
    );

    res.json({ message: "Task created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TASKS + ANTI-MAGER LOGIC
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;

    // update otomatis task yang telat
    await db.query(
      `UPDATE tasks 
       SET status = 'late', penalty = penalty + 10
       WHERE user_id = ? 
       AND status = 'pending' 
       AND deadline < NOW()`,
      [userId]
    );

    const [tasks] = await db.query(
      "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE STATUS
export const updateTaskStatus = async (req, res) => {
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
};