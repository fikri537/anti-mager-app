const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tasks`;

export type Task = {
  id: number;
  title: string;
  status: "pending" | "done" | "late";
  deadline: string;
  completed_at?: string | null;
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
  return apiCall(API_URL, { method: "GET" }, token);
};

/* =========================
   CREATE TASK
========================= */
export const createTask = async (
  body: { title: string; deadline: string },
  token: string
) => {
  return apiCall(
    API_URL,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    token
  );
};

/* =========================
   UPDATE TASK
========================= */
export const updateTask = async (
  id: number,
  status: string,
  token: string
) => {
  return apiCall(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
    token
  );
};

/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (id: number, token: string) => {
  return apiCall(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
    },
    token
  );
};