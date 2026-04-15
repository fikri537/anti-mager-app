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

export const updateTaskStatus = async (id, status) => {
  await db.query(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [status, id]
  );
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