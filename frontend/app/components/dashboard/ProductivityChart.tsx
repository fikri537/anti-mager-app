"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from "recharts";

import Card from "../ui/Card";
import { useEffect, useMemo, useState } from "react";
import { getTasks, Task } from "@/services/task.service";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type TaskWithMeta = Task & {
  completed_at?: string | null;
};

export default function ProductivityChart() {
  const [tasks, setTasks] = useState<TaskWithMeta[]>([]);

  /**
   * =========================
   * FETCH TASKS
   * =========================
   */
  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getTasks(token);

        const raw = res?.data ?? res;

        if (!Array.isArray(raw)) {
          setTasks([]);
          return;
        }

        setTasks(raw);
      } catch (err) {
        console.error("ProductivityChart error:", err);
        setTasks([]);
      }
    };

    fetch();
  }, []);

  /**
   * =========================
   * GROUP BY COMPLETED_AT (TRUE PRODUCTIVITY)
   * =========================
   */
  const chartData = useMemo(() => {
    const map = days.map((day) => ({
      day,
      productivity: 0,
    }));

    tasks.forEach((task) => {
      if (!task?.completed_at) return;

      const date = new Date(task.completed_at);

      if (isNaN(date.getTime())) return;

      const dayIndex = date.getDay();

      if (task.status === "done") {
        map[dayIndex].productivity += 1;
      }
    });

    return map;
  }, [tasks]);

  /**
   * =========================
   * UI
   * =========================
   */
  return (
    <Card className="h-full">

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">
            Productivity Analytics
          </h2>

          <p className="text-sm text-white/40 mt-1">
            Based on completed tasks (real activity time)
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-2 text-sm text-emerald-400">
          Live Data
        </div>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>

            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="day" stroke="#64748b" />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "20px",
              }}
            />

            <Area
              type="monotone"
              dataKey="productivity"
              stroke="#22d3ee"
              strokeWidth={4}
              fill="url(#gradient)"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>

    </Card>
  );
}