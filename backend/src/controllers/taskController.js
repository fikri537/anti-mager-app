import {
  getTasksByUser,
  createNewTask,
  updateTaskStatus,
  getLeaderboardData,
} from "../services/taskService.js";

import { successResponse, errorResponse } from "../utils/response.js";

export const getTasks = async (req, res) => {
  try {
    const data = await getTasksByUser(req.user.id);
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title || !deadline) {
      return errorResponse(res, "Title & deadline required", 400);
    }

    await createNewTask(req.user.id, title, deadline);

    return successResponse(res, null, "Task created");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const updateTask = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return errorResponse(res, "Status required", 400);
    }

    await updateTaskStatus(id, status);

    return successResponse(res, null, "Task updated");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const data = await getLeaderboardData();
    return successResponse(res, data);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};