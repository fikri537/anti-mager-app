const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/leaderboard`;

export type LeaderboardUser = {
  id: number;
  name: string;
  score: number;
};

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch leaderboard");
  }

  return response.json();
};