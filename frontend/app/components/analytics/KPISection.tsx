"use client";

import { useEffect, useMemo, useState } from "react";
import StatsCard from "../dashboard/StatsCard";
import { getTasks, Task } from "@/services/task.service";

export default function KPISection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getTasks(token);

        console.log("🔥 KPI RAW RESPONSE:", res);

        // ✅ FIX UTAMA DI SINI
        const data = res?.data ?? res ?? [];

        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load KPI tasks:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const kpi = useMemo(() => {
    const safeTasks = Array.isArray(tasks) ? tasks : [];

    const total = safeTasks.length;

    const done = safeTasks.filter((t) => t.status === "done").length;

    const late = safeTasks.filter((t) => t.status === "late").length;

    const completionRate =
      total === 0 ? 0 : Math.round((done / total) * 100);

    const score = safeTasks.reduce((acc, task) => {
      const status = (task.status || "").toLowerCase().trim();

      if (status === "done") return acc + 10;
      if (status === "late") return acc - 5;
      return acc;
    }, 0);

    const focusHours = Math.round(total * 1.6);

    let streak = 0;

    for (let i = safeTasks.length - 1; i >= 0; i--) {
      const status = (safeTasks[i].status || "").toLowerCase();

      if (status === "done") streak++;
      else break;
    }

    return {
      score,
      completionRate,
      focusHours,
      streak,
      late,
    };
  }, [tasks]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl bg-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Productivity Score"
        value={kpi.score}
        desc="Based on real database tasks"
        color="text-cyan-400"
      />

      <StatsCard
        title="Completion Rate"
        value={kpi.completionRate}
        desc="From backend task data"
        color="text-emerald-400"
      />

      <StatsCard
        title="Focus Hours"
        value={kpi.focusHours}
        desc="Estimated from activity"
        color="text-violet-400"
      />

      <StatsCard
        title="Current Streak"
        value={kpi.streak}
        desc="Consecutive completed tasks"
        color="text-amber-400"
      />
    </div>
  );
}