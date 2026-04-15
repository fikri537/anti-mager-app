const BASE_URL = "http://localhost:5000/api";

export interface AuthData {
  name?: string; // optional untuk login
  email: string;
  password: string;
}

export interface TaskData {
  title: string;
  description?: string;
  deadline: string;
}

const safeFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    const text = await res.text();
    console.error("NON-JSON RESPONSE:", text);
    throw new Error("Server error (not JSON response)");
  }

  return res.json();
};

export const registerUser = async (data: AuthData) => {
  return safeFetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const loginUser = async (data: AuthData) => {
  return safeFetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const getTasks = async (token: string) => {
  return safeFetch(`${BASE_URL}/tasks`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
};

export const createTask = async (data: TaskData, token: string) => {
  return safeFetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
};

export const updateTask = async (
  id: number,
  status: string,
  token: string
) => {
  return safeFetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify({ status }),
  });
};