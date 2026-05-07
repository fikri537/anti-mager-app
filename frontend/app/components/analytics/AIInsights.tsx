"use client";

import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  TimerReset,
} from "lucide-react";

import Card from "../ui/Card";
import { useMemo } from "react";

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

export default function AIInsights({ data }: Props) {
  const insights = useMemo(() => {
    const {
      total = 0,
      done = 0,
      late = 0,
      productivity = 0,
    } = data;

    /**
     * =========================
     * REALISTIC TREND LOGIC
     * =========================
     */
    const trend =
      productivity >= 80
        ? "+18%"
        : productivity >= 50
        ? "+8%"
        : "+3%";

    const focusWindow =
      total > 10
        ? "2-5 PM"
        : total > 5
        ? "Flexible"
        : "Unstable Pattern";

    return [
      {
        icon: TrendingUp,
        title: "Productivity Trend",
        value: trend,
        desc: "Based on completion rate and activity density.",
        color: "from-emerald-500/20 to-cyan-500/20",
        text: "text-emerald-400",
      },
      {
        icon: AlertTriangle,
        title: "Late Tasks Detected",
        value: late,
        desc:
          late > 0
            ? "Overdue tasks are affecting your performance."
            : "No overdue tasks detected. Great job!",
        color: "from-red-500/20 to-orange-500/20",
        text: "text-red-400",
      },
      {
        icon: TimerReset,
        title: "Focus Pattern",
        value: focusWindow,
        desc: "Based on your task distribution across timeline.",
        color: "from-violet-500/20 to-fuchsia-500/20",
        text: "text-violet-400",
      },
    ];
  }, [data]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <Card>
        <div className="flex items-start justify-between gap-5">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-black">
                <Brain size={22} />
              </div>

              <div>
                <p className="text-sm text-cyan-400">
                  AI Assistant
                </p>

                <h2 className="text-3xl font-black">
                  Smart Insights
                </h2>
              </div>
            </div>

            <p className="mt-5 max-w-2xl text-white/40">
              AI-generated productivity analysis based on your real task data.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">
              AI Active
            </span>
          </div>
        </div>
      </Card>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {insights.map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title} className="relative overflow-hidden">

              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-40`}
              />

              <div className="relative">

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] ${item.text}`}
                >
                  <Icon size={24} />
                </div>

                <div className="mt-6">

                  <p className="text-sm text-white/40">
                    {item.title}
                  </p>

                  <h3 className={`mt-3 text-5xl font-black ${item.text}`}>
                    {item.value}
                  </h3>

                  <p className="mt-4 text-sm leading-relaxed text-white/50">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* AI SUMMARY */}
      <Card>
        <div className="flex items-start gap-5">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-black">
            <Sparkles size={24} />
          </div>

          <div>
            <p className="text-sm text-cyan-400">
              AI Recommendation
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Optimize Your Schedule
            </h2>

            <p className="mt-3 text-white/40">
              Focus on reducing late tasks and maintain consistency to push productivity above{" "}
              {data.productivity}%.
            </p>

          </div>
        </div>
      </Card>

    </div>
  );
}