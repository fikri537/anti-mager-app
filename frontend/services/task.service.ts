const API_URL = "http://localhost:5000/api/tasks";

export type Task = {
  id: number;
  title: string;
  status: "pending" | "done" | "late";
  deadline: string;
  completed_at?: string | null; // 🔥 WAJIB JADI OPTIONAL
};

/**
 * helper fetch biar gak repetitif
 */
const apiCall = async (
  url: string,
  options: RequestInit,
  token: string
) => {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};

/* =========================
   GET TASKS
========================= */
export const getTasks = async (token: string) => {
  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 FIX DI SINI
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};

/* =========================
   CREATE TASK
========================= */
export const createTask = async (
  body: { title: string; deadline: string },
  token: string
) => {
  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 penting
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};

/* =========================
   UPDATE TASK
========================= */
export const updateTask = async (
  id: number,
  status: string,
  token: string
) => {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};

/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (id: number, token: string) => {
  const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // 🔥
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
};