"use client";

import { Bell, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getTasks, Task } from "@/services/task.service";

export default function Topbar() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState("");
  const [now] = useState(() => Date.now());

  /**
   * =========================
   * FETCH REAL TASK DATA
   * =========================
   */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getTasks(token);

        const data = Array.isArray(res?.data) ? res.data : res;

        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Topbar fetch error:", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  /**
   * =========================
   * REAL STATS
   * =========================
   */
  const stats = useMemo(() => {
  const total = tasks.length;

  const done = tasks.filter((t) => t.status === "done").length;

  const late = tasks.filter((t) => {
    const deadline = new Date(t.deadline).getTime();

    const isLate =
      t.status !== "done" &&
      deadline < now; // ✅ FIX: no Date.now()

    return isLate;
  }).length;

  return { total, done, late };
}, [tasks, now]);

  /**
   * =========================
   * SEARCH EVENT (GLOBAL SIMPLE)
   * =========================
   */
  useEffect(() => {
    const filtered = tasks.filter((t) =>
      t.title.toLowerCase().includes(query.toLowerCase())
    );

    // kirim ke window event (biar bisa dipakai di page lain)
    window.dispatchEvent(
      new CustomEvent("TASK_SEARCH", { detail: filtered })
    );
  }, [query, tasks]);

  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

      {/* LEFT */}
      <div>
        <p className="text-sm text-white/40">
          Welcome Guys To
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Your Productivity{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
            Dashboard
          </span>
        </h1>

        {/* MINI REAL STATS */}
        <div className="mt-3 flex gap-4 text-sm text-white/50">
          <span>📌 Total: {stats.total}</span>
          <span>✅ Done: {stats.done}</span>
          <span>⚠️ Late: {stats.late}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
      </div>
    </div>
  );
}