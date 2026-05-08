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

/**
 * =========================
 * TASK TYPE (FIXED)
 * =========================
 */
type Task = {
  id: number;
  title: string;
  status: "pending" | "done" | "late";
  deadline: string;
  completed_at?: string | null; // 🔥 IMPORTANT FIX
};

export default function AnalyticsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * =========================
   * FETCH DATA
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

        const data: Task[] = Array.isArray(res?.data)
          ? res.data
          : [];

        setTasks(data);
      } catch (err) {
        console.error(err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * =========================
   * NORMALIZE STATUS
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
   * STATS
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

  const productivity = total === 0 ? 0 : Math.round((done / total) * 100);

  return {
    total,
    done,
    late,
    pending,
    score, // ✅ FIX INI
    productivity,
  };
}, [normalizedTasks]);

  /**
   * =========================
   * WEEKLY DATA (BASED ON completed_at)
   * =========================
   */
  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const map = days.map(d => ({
      day: d,
      completed: 0,
      focus: 0,
    }));

    normalizedTasks.forEach(task => {
      if (task.status === "done" && task.completed_at) {
        const date = new Date(task.completed_at);
        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          map[dayIndex].completed += 1;
        }
      }

      if (task.status !== "late") {
        const date = new Date(task.deadline);
        if (!isNaN(date.getTime())) {
          const dayIndex = date.getDay();
          map[dayIndex].focus += 1;
        }
      }
    });

    return map;
  }, [normalizedTasks]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-hidden">

      <div className="relative flex">
        <Sidebar />

        <main className="flex-1 p-5 pb-32 lg:p-8">

          <Topbar />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h1 className="text-4xl font-black">
              Productivity Analytics
            </h1>

            <p className="text-white/40 mt-3">
              Real-time insights from your tasks
            </p>
          </motion.section>

          <section className="mt-10">
            <KPISection />
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-12">

            <div className="2xl:col-span-7">
              <WeeklyChart data={weeklyData} />
            </div>

            <div className="space-y-6 2xl:col-span-5">
              <ProductivityRadar data={stats} />
              <AIInsights data={stats} />
            </div>
          </section>

          <section className="mt-8">
            <ProductivityHeatmap data={normalizedTasks} />
          </section>

        </main>
      </div>

      <MobileNav />
    </div>
  );
}