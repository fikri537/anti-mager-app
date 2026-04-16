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
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.replace("/login");
    } else {
      setToken(t);
    }
  }, [router]);

  const fetchTasks = async (tkn: string) => {
    try {
      setLoading(true);
      const res = await getTasks(tkn);

      if (res.success && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
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

    await createTask({ title, deadline }, token);
    fetchTasks(token);
    setTitle("");
    setDeadline("");
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

  const deleteTask = async (id: number) => {
    if (!token) return;

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    fetchTasks(token);
  };

  const isLate = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  const getStatus = (task: Task) => {
    if (task.status === "done") return "done";
    if (isLate(task.deadline)) return "late";
    return "pending";
  };

  const getScore = (task: Task) => {
    if (getStatus(task) === "done") return 10;
    if (getStatus(task) === "late") return -5;
    return 0;
  };

  const total = tasks.length;
  const done = tasks.filter((t) => getStatus(t) === "done").length;
  const late = tasks.filter((t) => getStatus(t) === "late").length;
  const pending = tasks.filter((t) => getStatus(t) === "pending").length;
  const score = tasks.reduce((acc, t) => acc + getScore(t), 0);

  const chartData = [
    { name: "Done", value: done },
    { name: "Pending", value: pending },
    { name: "Late", value: late },
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return getStatus(task) === filter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500 p-6 text-white">
      
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">🔥 Anti-Mager</h1>

        <div className="space-x-4">
          <a href="/leaderboard" className="underline">
            Leaderboard
          </a>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* SCORE */}
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 p-6 rounded-2xl mb-6 shadow-lg">
        <p>Your Score</p>
        <h2 className="text-4xl font-bold">{score} pts</h2>
      </div>

      {/* CHART */}
      <div className="relative p-6 rounded-2xl mb-6 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 opacity-30 blur-2xl"></div>

        <div className="relative bg-white text-black p-5 rounded-xl">
          <h2 className="mb-4 font-semibold">Task Overview</h2>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#333" />
              <Tooltip />

              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
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

      {/* CREATE */}
      <div className="backdrop-blur-lg bg-white/20 p-6 rounded-2xl mb-6 space-y-3">
        <input
          placeholder="Task title"
          className="p-2 w-full rounded bg-white/30"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="p-2 w-full rounded bg-white/30"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black px-4 py-2 w-full rounded"
        >
          Add Task
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
        {["all", "done", "pending", "late"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="bg-white/20 px-3 py-1 rounded"
          >
            {f}
          </button>
        ))}
      </div>

      {/* TASK LIST */}
      {loading && <p>Loading...</p>}

      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="backdrop-blur-lg bg-white/20 p-4 rounded-xl flex justify-between"
          >
            <div>
              <h2 className="font-bold">{task.title}</h2>

              <p
                className={
                  getStatus(task) === "done"
                    ? "text-green-300"
                    : getStatus(task) === "late"
                    ? "text-red-300"
                    : "text-yellow-300"
                }
              >
                {getStatus(task)}
              </p>

              <p>{new Date(task.deadline).toLocaleString()}</p>
              <p>Score: {getScore(task)}</p>
            </div>

            <div className="space-y-2">
              {getStatus(task) !== "done" && (
                <button
                  onClick={() => markAsDone(task.id)}
                  className="bg-green-500 px-3 py-1 rounded"
                >
                  Done
                </button>
              )}

              <button
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}