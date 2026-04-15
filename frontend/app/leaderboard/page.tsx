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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);

        const data = await getLeaderboard();

        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data.users) {
          setUsers(data.users);
        } else {
          console.error("Invalid leaderboard:", data);
          setUsers([]);
        }
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

      {loading && <p>Loading...</p>}

      <ul className="space-y-3">
        {users.map((user, index) => (
          <li
            key={user.id}
            className="border p-4 flex justify-between rounded"
          >
            <span>
              #{index + 1} — {user.name}
            </span>
            <span className="font-bold">{user.score} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}