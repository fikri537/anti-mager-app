"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import Card from "../ui/Card";

type Props = {
  data: {
    total: number;
    done: number;
    late: number;
    pending: number;
    score: number;
    productivity: number;
  };
};

export default function ProductivityRadar({ data }: Props) {
  /**
   * =========================
   * SAFE NORMALIZATION
   * =========================
   */
  const total = data?.total || 0;
  const done = data?.done || 0;
  const late = data?.late || 0;
  const pending = data?.pending || 0;

  /**
   * =========================
   * REAL PRODUCTIVITY SCORE
   * =========================
   */
  const score =
    total === 0 ? 0 : Math.round((done / total) * 100);

  /**
   * =========================
   * REAL RADAR METRICS
   * =========================
   */
  const radarData = [
    {
      subject: "Focus",
      value: score,
    },
    {
      subject: "Discipline",
      value:
        total === 0 ? 100 : Math.max(0, 100 - late * 15),
    },
    {
      subject: "Consistency",
      value: score,
    },
    {
      subject: "Execution",
      value:
        total === 0
          ? 0
          : Math.round((done / total) * 100),
    },
    {
      subject: "Planning",
      value:
        total === 0
          ? 100
          : Math.max(0, 100 - pending * 12),
    },
    {
      subject: "Time Mgmt",
      value: score,
    },
  ];

  /**
   * =========================
   * UI
   * =========================
   */
  return (
    <Card className="h-full">

      {/* HEADER */}
      <div className="mb-8">
        <p className="text-sm text-violet-400">
          Performance Analysis
        </p>

        <h2 className="mt-2 text-3xl font-black">
          Productivity Score
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/40">
          Real-time analytics derived directly from your task database.
        </p>
      </div>

      {/* SCORE */}
      <div className="mb-10 flex items-center gap-5">

        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
          <span className="text-4xl font-black text-cyan-400">
            {score}
          </span>
        </div>

        <div>
          <p className="text-sm text-white/40">
            Overall Productivity
          </p>

          <h3 className="mt-2 text-2xl font-black">
            {score > 75
              ? "Excellent"
              : score > 50
              ? "Good"
              : "Needs Improvement"}
          </h3>

          <p className="mt-2 text-sm text-emerald-400">
            {score > 70
              ? "+ strong performance"
              : "+ needs consistency"}
          </p>
        </div>
      </div>

      {/* CHART */}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>

            <PolarGrid stroke="rgba(255,255,255,0.08)" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "rgba(255,255,255,0.55)",
                fontSize: 12,
              }}
            />

            <Radar
              name="Productivity"
              dataKey="value"
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

    </Card>
  );
}