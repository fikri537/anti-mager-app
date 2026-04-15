const BASE_URL = "http://localhost:5000/api";

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