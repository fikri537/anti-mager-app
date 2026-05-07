"use client";

import { useMemo } from "react";
import { ActivityCalendar } from "react-activity-calendar";

import Card from "../ui/Card";
import { Task } from "@/services/task.service";

type Props = {
  data?: Task[]; // dari AnalyticsPage
};

export default function ProductivityHeatmap({ data = [] }: Props) {
  /**
   * =========================
   * NORMALIZE → CALENDAR FORMAT
   * =========================
   */
  const calendarData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const map = new Map<
      string,
      { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
    >();

    data.forEach((task) => {
      if (!task?.deadline) return;

      const date = new Date(task.deadline)
        .toISOString()
        .split("T")[0];

      const existing = map.get(date);

      const isDone = task.status === "done";

      const prevCount = existing?.count ?? 0;

      const newCount = isDone ? prevCount + 1 : prevCount;

      // level sederhana (bisa kamu tweak nanti)
      const level: 0 | 1 | 2 | 3 | 4 =
        newCount >= 4
          ? 4
          : newCount === 3
          ? 3
          : newCount === 2
          ? 2
          : newCount === 1
          ? 1
          : 0;

      map.set(date, {
        date,
        count: newCount,
        level,
      });
    });

    return Array.from(map.values());
  }, [data]);

  /**
   * =========================
   * HANDLE EMPTY STATE (INI PENTING)
   * =========================
   */
  if (!calendarData.length) {
    return (
      <Card>
        <p className="text-white/40">
          No activity data yet.
        </p>
      </Card>
    );
  }

  /**
   * =========================
   * UI
   * =========================
   */
  return (
    <Card>
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-cyan-400">
            Activity Overview
          </p>

          <h2 className="mt-2 text-3xl font-black">
            Productivity Heatmap
          </h2>

          <p className="mt-3 max-w-2xl text-white/40">
            Visual representation of your daily task activity.
          </p>
        </div>

        <div className="rounded-[24px] border border-orange-500/20 bg-orange-500/10 px-6 py-5">
          <p className="text-sm text-orange-300">
            Current Streak
          </p>

          <h3 className="mt-2 text-4xl font-black text-orange-400">
            {data.filter((t) => t.status === "done").length}
          </h3>

          <p className="mt-1 text-sm text-orange-200/60">
            completed tasks days
          </p>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="overflow-x-auto rounded-[24px] border border-white/5 bg-white/[0.02] p-6">
        <ActivityCalendar
          data={calendarData}
          blockSize={16}
          blockMargin={5}
          fontSize={14}
          showWeekdayLabels
          theme={{
            light: [
              "rgba(255,255,255,0.04)",
              "#164e63",
              "#0891b2",
              "#22d3ee",
              "#67e8f9",
            ],
            dark: [
              "rgba(255,255,255,0.04)",
              "#164e63",
              "#0891b2",
              "#22d3ee",
              "#67e8f9",
            ],
          }}
        />
      </div>

      {/* FOOTER */}
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/40">Best Day</p>
          <h3 className="mt-3 text-3xl font-black text-cyan-400">
            —
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/40">Tasks Completed</p>
          <h3 className="mt-3 text-3xl font-black text-emerald-400">
            {data.filter((t) => t.status === "done").length}
          </h3>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/40">Consistency</p>
          <h3 className="mt-3 text-3xl font-black text-violet-400">
            —
          </h3>
        </div>
      </div>
    </Card>
  );
}