"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  id: number;
  name: string;
  score: number;
};

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getLeaderboard();
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
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
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      
      {/* BACKGROUND GLOW (samain dashboard) */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-sm text-cyan-400">Competition Board</p>
            <h1 className="text-4xl font-black mt-2">
              Productivity Leaderboard
            </h1>
            <p className="text-white/40 mt-3">
              Top performers ranked by productivity score
            </p>
          </div>

          <a
            href="/dashboard"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Dashboard
          </a>
        </motion.div>

        {/* LIST */}
        <div className="space-y-4">
          <AnimatePresence>
            {loading ? (
              <div className="text-white/40 text-center py-10">
                Loading leaderboard...
              </div>
            ) : (
              users.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`
                    relative overflow-hidden rounded-2xl border border-white/10
                    bg-white/[0.03] backdrop-blur-xl px-6 py-5
                    flex items-center justify-between
                  `}
                >
                  {/* glow highlight top 3 */}
                  {i === 0 && (
                    <div className="absolute inset-0 bg-yellow-400/10" />
                  )}
                  {i === 1 && (
                    <div className="absolute inset-0 bg-gray-300/10" />
                  )}
                  {i === 2 && (
                    <div className="absolute inset-0 bg-orange-400/10" />
                  )}

                  {/* LEFT */}
                  <div className="relative flex items-center gap-4">
                    <div className="text-2xl w-10 text-center">
                      {getMedal(i)}
                    </div>

                    <div>
                      <p className="font-semibold text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/40">
                        Rank #{i + 1}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SCORE */}
                  <div className="relative text-right">
                    <p className="text-2xl font-black text-cyan-400">
                      {user.score}
                    </p>
                    <p className="text-xs text-white/40">points</p>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* EMPTY STATE */}
        {!loading && users.length === 0 && (
          <div className="text-center mt-12 text-white/40">
            Belum ada data leaderboard 😢
          </div>
        )}
      </div>
    </div>
  );
}