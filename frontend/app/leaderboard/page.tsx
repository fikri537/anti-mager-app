"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/services/api";

type User = {
  id: number;
  name: string;
  score: number;
};

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getLeaderboard();
      setUsers(Array.isArray(res.data) ? res.data : []);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

        <div className="space-y-3">
          {users.map((user, i) => (
            <div
              key={user.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between"
            >
              <span>
                #{i + 1} — {user.name}
              </span>
              <span className="font-bold">{user.score} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}