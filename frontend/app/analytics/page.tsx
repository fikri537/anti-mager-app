"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import MobileNav from "../components/dashboard/MobileNav";

import KPISection from "../components/analytics/KPISection";
import WeeklyChart from "../components/analytics/WeeklyChart";
import ProductivityHeatmap from "../components/analytics/ProductivityHeatmap";
import AIInsights from "../components/analytics/AIInsights";
import ProductivityRadar from "../components/analytics/ProductivityRadar";

import { getTasks } from "@/services/task.service";

type Task = {
  id: number;
  title: string;
  status: "pending" | "done" | "late";
  deadline: string;
};

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * =========================
   * FETCH DATA (FIXED)
   * =========================
   */
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await getTasks(token);

        const data = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        setTasks(data);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * =========================
   * NORMALIZE TASK STATUS
   * =========================
   */
  const normalizedTasks = useMemo(() => {
    return tasks.map((t) => {
      const isLate =
        t.status !== "done" &&
        new Date(t.deadline).getTime() < Date.now();

      return {
        ...t,
        status: isLate ? "late" : t.status,
      };
    });
  }, [tasks]);

  /**
   * =========================
   * STATS (REAL DATA)
   * =========================
   */
  const stats = useMemo(() => {
    const total = normalizedTasks.length;

    const done = normalizedTasks.filter((t) => t.status === "done").length;
    const late = normalizedTasks.filter((t) => t.status === "late").length;
    const pending = normalizedTasks.filter((t) => t.status === "pending").length;

    const score = normalizedTasks.reduce((acc, t) => {
      if (t.status === "done") return acc + 10;
      if (t.status === "late") return acc - 5;
      return acc;
    }, 0);

    const productivity =
      total === 0 ? 0 : Math.round((done / total) * 100);

    return {
      total,
      done,
      late,
      pending,
      score,
      productivity,
    };
  }, [normalizedTasks]);

  /**
   * =========================
   * WEEKLY DATA (FIXED + SAFE)
   * =========================
   */
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const map = days.map((d) => ({
      name: d,
      done: 0,
    }));

    normalizedTasks.forEach((task) => {
      if (!task?.deadline) return;

      const date = new Date(task.deadline);
      if (isNaN(date.getTime())) return;

      const dayIndex = date.getDay();

      if (task.status === "done") {
        map[dayIndex].done += 1;
      }
    });

    return map;
  }, [normalizedTasks]);

  /**
   * =========================
   * LOADING STATE
   * =========================
   */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  /**
   * =========================
   * UI
   * =========================
   */
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[120px]" />
      </div>

      <div className="relative flex">

        <Sidebar />

        <main className="flex-1 p-5 pb-32 lg:p-8">

          <Topbar />

          {/* HERO */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-end 2xl:justify-between">

              <div>
                <p className="text-sm text-cyan-400">
                  Analytics Overview
                </p>

                <h1 className="mt-3 text-4xl font-black sm:text-5xl">
                  Productivity Analytics
                </h1>

                <p className="mt-5 text-white/40 max-w-3xl">
                  Real-time insights from your actual tasks.
                </p>
              </div>

              <div className="glass-card flex items-center gap-5 rounded-[28px] px-6 py-5">
                <div className="text-2xl">🚀</div>

                <div>
                  <p className="text-sm text-white/40">
                    Productivity Score
                  </p>
                  <h2 className="text-3xl font-black text-cyan-400">
                    {stats.productivity}%
                  </h2>
                </div>
              </div>
            </div>
          </motion.section>

          {/* KPI */}
          <section className="mt-10">
            <KPISection />
          </section>

          {/* GRID */}
          <section className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-12">

            <div className="2xl:col-span-7">
              <WeeklyChart data={weeklyData} />
            </div>

            <div className="space-y-6 2xl:col-span-5">
              <ProductivityRadar data={stats} />
              <AIInsights data={stats} />
            </div>
          </section>

          {/* HEATMAP */}
          <section className="mt-8">
            <ProductivityHeatmap data={normalizedTasks} />
          </section>

        </main>
      </div>

      <MobileNav />
    </div>
  );
}