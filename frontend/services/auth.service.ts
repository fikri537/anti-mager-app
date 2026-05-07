const API_URL =
  "http://localhost:5000/api/leaderboard";

export type LeaderboardUser = {
  id: number;
  name: string;
  score: number;
};

export const getLeaderboard =
  async (): Promise<
    LeaderboardUser[]
  > => {
    const response = await fetch(
      API_URL
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch leaderboard"
      );
    }

    return response.json();
  };