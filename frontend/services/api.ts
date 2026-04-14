const BASE_URL = "http://localhost:5000/api";

export const registerUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getTasks = async (token: string) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    headers: {
      Authorization: token,
    },
  });
  return res.json();
};

export const createTask = async (data: any, token: string) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};