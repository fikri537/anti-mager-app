import { db } from "../config/db.js";

export const updateLateTasks = async () => {
  await db.query(`
    UPDATE tasks 
    SET status = 'late'
    WHERE deadline < NOW() 
    AND status = 'pending'
  `);
};

export const getTasksByUser = async (userId) => {
  await updateLateTasks();

  const [tasks] = await db.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY deadline ASC",
    [userId]
  );

  return tasks;
};

export const createNewTask = async (userId, title, deadline) => {
  await db.query(
    "INSERT INTO tasks (title, deadline, status, penalty, user_id) VALUES (?, ?, 'pending', 0, ?)",
    [title, deadline, userId]
  );
};

export const updateTaskStatus = async (taskId, userId, status) => {
  const [rows] = await db.query(
    "SELECT status, completed_at FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );

  if (!rows.length) {
    throw new Error("Task not found or unauthorized");
  }

  const task = rows[0];

  let completedAt = task.completed_at;

  /**
   * =========================
   * RULE:
   * - first time DONE → set completed_at
   * - undo DONE → reset completed_at
   * =========================
   */
  if (status === "done" && !task.completed_at) {
    completedAt = new Date();
  }

  if (status !== "done") {
    completedAt = null;
  }

  const [result] = await db.query(
    `
    UPDATE tasks 
    SET status = ?, completed_at = ?
    WHERE id = ? AND user_id = ?
    `,
    [status, completedAt, taskId, userId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Task not found or unauthorized");
  }
};

export const deleteTaskById = async (taskId, userId) => {
  const [result] = await db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Task not found or unauthorized");
  }
};

export const getLeaderboardData = async () => {
  await updateLateTasks();

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

  return rows;
};