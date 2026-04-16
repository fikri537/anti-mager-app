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
      try {
        const res = await getLeaderboard();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      }
    };

    fetchData();
  }, []);

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-6 text-white">
      
      <div className="max-w-xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🏆 Leaderboard</h1>
          <a href="/dashboard" className="underline">
            ← Dashboard
          </a>
        </div>

        {/* LIST */}
        <div className="space-y-3">
          {users.map((user, i) => (
            <div
              key={user.id}
              className={`backdrop-blur-lg bg-white/20 border border-white/30 p-4 rounded-xl shadow flex justify-between items-center
              ${i === 0 ? "scale-105 bg-yellow-300/30" : ""}
              ${i === 1 ? "bg-gray-300/30" : ""}
              ${i === 2 ? "bg-orange-300/30" : ""}
              `}
            >
              <span className="font-semibold">
                {getMedal(i)} — {user.name}
              </span>

              <span className="font-bold text-lg">
                {user.score} pts
              </span>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {users.length === 0 && (
          <div className="text-center mt-10 opacity-70">
            Belum ada data leaderboard 😢
          </div>
        )}
      </div>
    </div>
  );
}