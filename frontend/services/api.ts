const BASE_URL = "http://localhost:5000/api";

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

  return res.json();
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

export const createTask = async (
  data: { title: string; deadline: string },
  token: string
) => {
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

export const getLeaderboard = async () => {
  const res = await fetch(`${BASE_URL}/tasks/leaderboard`);
  return res.json();
};