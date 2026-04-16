"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTasks, createTask } from "@/services/api";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Task = {
  id: number;
  title: string;
  status: "pending" | "done" | "late";
  penalty: number;
  deadline: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
      return;
    }
    setToken(t);
  }, [router]);

  const fetchTasks = async (tkn: string) => {
    try {
      setLoading(true);
      const res = await getTasks(tkn);

      if (res.success && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        console.error("Invalid response:", res);
        setTasks([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchTasks(token);
  }, [token]);

  const handleCreate = async () => {
    if (!token || !title || !deadline) return;

    try {
      await createTask({ title, deadline }, token);
      await fetchTasks(token);
      setTitle("");
      setDeadline("");
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const markAsDone = async (id: number) => {
    if (!token) return;

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status: "done" }),
    });

    fetchTasks(token);
  };

  const getScore = (task: Task) => {
    if (task.status === "done") return 10;
    if (task.status === "late") return -5;
    return 0;
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const late = tasks.filter((t) => t.status === "late").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const score = tasks.reduce((acc, t) => acc + getScore(t), 0);

  const chartData = [
    { name: "Done", value: done },
    { name: "Pending", value: pending },
    { name: "Late", value: late },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-6 text-white">
      
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">🔥 Anti-Mager</h1>
        <a href="/leaderboard" className="underline">
          Leaderboard →
        </a>
      </div>

      {/* SCORE CARD */}
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 p-6 rounded-2xl mb-6 shadow-lg">
        <p className="text-lg">Your Score</p>
        <h2 className="text-4xl font-bold">{score} pts</h2>
      </div>

      {/* CHART */}
      <div className="relative p-6 rounded-2xl mb-6 shadow-lg overflow-hidden">

        {/* PAINT BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-30 blur-2xl"></div>

        {/* WHITE CARD */}
        <div className="relative bg-white text-black p-5 rounded-xl">
          <h2 className="mb-4 font-semibold">Task Overview</h2>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#333" />
              <Tooltip />

              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "Done"
                        ? "#22c55e"
                        : entry.name === "Pending"
                        ? "#eab308"
                        : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CREATE TASK */}
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 p-6 rounded-2xl mb-6 shadow-lg space-y-3">
        <input
          placeholder="Task title"
          className="p-2 w-full rounded bg-white/30 text-white placeholder-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="p-2 w-full rounded bg-white/30 text-white"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black/80 hover:bg-black px-4 py-2 w-full rounded"
        >
          Add Task
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass">Total: {total}</div>
        <div className="glass">Done: {done}</div>
        <div className="glass">Late: {late}</div>
        <div className="glass">Pending: {pending}</div>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* TASK LIST */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="backdrop-blur-lg bg-white/20 border border-white/30 p-4 rounded-xl flex justify-between"
          >
            <div>
              <h2 className="font-bold text-lg">{task.title}</h2>

              <p
                className={
                  task.status === "done"
                    ? "text-green-300"
                    : task.status === "late"
                    ? "text-red-300"
                    : "text-yellow-300"
                }
              >
                {task.status}
              </p>

              <p className="text-sm">
                {new Date(task.deadline).toLocaleString()}
              </p>

              <p>Score: {getScore(task)}</p>
            </div>

            {task.status !== "done" && (
              <button
                onClick={() => markAsDone(task.id)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Done
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* GLASS STYLE */}
      <style jsx>{`
        .glass {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 12px;
          border-radius: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}