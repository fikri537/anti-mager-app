import { apiFetch } from "../app/lib/api";

export type LeaderboardUser = {
  id: number;
  name: string;
  score: number;
};

export const getLeaderboard =
  async () => {
    return apiFetch<{
      success: boolean;
      data: LeaderboardUser[];
    }>("/tasks/leaderboard");
  };