const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/* =========================
   AUTH
========================= */

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result?.message || "Register failed");

  return result;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result?.message || "Login failed");

  return result;
};

/* =========================
   TASKS
========================= */

export const getTasks = async (token: string) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result?.message || "Failed to fetch tasks");

  return result;
};

export const createTask = async (
  data: { title: string; deadline: string },
  token: string
) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result?.message || "Failed to create task");

  return result;
};

/* =========================
   LEADERBOARD
========================= */

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/leaderboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result?.message || "Failed to fetch leaderboard");

  return result;
};