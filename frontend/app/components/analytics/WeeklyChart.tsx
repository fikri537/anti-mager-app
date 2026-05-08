"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import Card from "../ui/Card";

type WeeklyChartData = {
  day: string;
  completed: number;
  focus: number;
};

type Props = {
  data?: WeeklyChartData[];
};

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyChart({ data = [] }: Props) {
  const safe = Array.isArray(data) ? data : [];

  const chartData = days.map((day, index) => {
    const item = safe[index];

    return {
      day,
      completed: item?.completed ?? 0,
      focus: item?.focus ?? 0,
    };
  });

  return (
    <Card className="h-full w-full">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-sm text-cyan-400">Weekly Activity</p>
          <h2 className="mt-2 text-3xl font-black">
            Productivity Trend
          </h2>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-400">
          Live Data
        </div>
      </div>

      <div className="h-[360px] w-full min-h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{
                fill: "rgba(255,255,255,0.4)",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "18px",
                color: "#fff",
              }}
            />

            <Area
              type="monotone"
              dataKey="completed"
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.25}
              strokeWidth={3}
            />

            <Area
              type="monotone"
              dataKey="focus"
              stroke="#a855f7"
              fill="#a855f7"
              fillOpacity={0.15}
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}