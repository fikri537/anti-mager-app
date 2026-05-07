"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  LogOut,
} from "lucide-react";

import clsx from "clsx";
import { getTasks, Task } from "@/services/task.service";

const menu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * =========================
   * FETCH TASKS (REAL DB)
   * =========================
   */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getTasks(token);

        // adaptasi response API kamu
        const data = Array.isArray(res?.data) ? res.data : res;

        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Sidebar task fetch error:", err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  /**
   * =========================
   * REAL STREAK LOGIC
   * =========================
   */
  const streak = useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) return 0;

    const sorted = [...tasks].sort(
      (a, b) =>
        new Date(b.deadline).getTime() -
        new Date(a.deadline).getTime()
    );

    let count = 0;

    for (const task of sorted) {
      if (!task?.status) continue;

      if (task.status.toLowerCase() === "done") {
        count++;
      } else {
        break;
      }
    }

    return count;
  }, [tasks]);

  return (
    <aside className="hidden xl:flex flex-col w-[280px] min-h-screen border-r border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6">

      {/* LOGO */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-black font-black text-xl">
          A
        </div>

        <div>
          <h1 className="text-xl font-black">
            AntiMager
          </h1>

          <p className="text-sm text-white/40">
            Productivity Managing
          </p>
        </div>
      </div>

      {/* MENU */}
      <div className="mt-12 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300",
                pathname === item.href
                  ? "bg-gradient-to-r from-cyan-400/20 to-violet-500/20 border border-cyan-400/20 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* STREAK CARD */}
      <div className="mt-10 glass-card rounded-[28px] p-5">
        <p className="text-sm text-white/40">
          Current Streak
        </p>

        <h2 className="text-5xl font-black mt-3">
          {loading ? "..." : streak}
        </h2>

        <p className="text-sm text-emerald-400 mt-3">
          You&apos;re doing great 🔥
        </p>
      </div>

      {/* LOGOUT */}
      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="w-full flex items-center justify-center gap-3 rounded-2xl py-4 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}