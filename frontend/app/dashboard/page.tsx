"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTasks, createTask } from "@/services/api";

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
    if (token) fetchTasks(token);
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

  const totalSafe = total || 1;
  const donePercent = (done / totalSafe) * 100;
  const latePercent = (late / totalSafe) * 100;
  const pendingPercent = (pending / totalSafe) * 100;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🔥 Anti-Mager</h1>
          <a href="/leaderboard" className="text-blue-600">
            Leaderboard →
          </a>
        </div>

        {/* SCORE CARD */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="text-gray-500">Your Score</h2>
          <p className="text-3xl font-bold">{score} pts</p>
        </div>

        {/* GRAPH */}
        <div className="bg-white p-5 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-3">Task Overview</h2>

          <div className="w-full h-4 flex rounded overflow-hidden">
            <div
              className="bg-green-500"
              style={{ width: `${donePercent}%` }}
            />
            <div
              className="bg-yellow-500"
              style={{ width: `${pendingPercent}%` }}
            />
            <div
              className="bg-red-500"
              style={{ width: `${latePercent}%` }}
            />
          </div>

          <div className="flex justify-between text-sm mt-2">
            <span>Done</span>
            <span>Pending</span>
            <span>Late</span>
          </div>
        </div>

        {/* CREATE TASK */}
        <div className="bg-white p-5 rounded-xl shadow mb-6 space-y-3">
          <input
            placeholder="Task title"
            className="border p-2 w-full rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="datetime-local"
            className="border p-2 w-full rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button
            onClick={handleCreate}
            className="bg-black text-white w-full py-2 rounded"
          >
            Add Task
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-3 mb-6 text-center">
          <div className="bg-white p-3 rounded shadow">Total<br />{total}</div>
          <div className="bg-white p-3 rounded shadow">Done<br />{done}</div>
          <div className="bg-white p-3 rounded shadow">Late<br />{late}</div>
          <div className="bg-white p-3 rounded shadow">Pending<br />{pending}</div>
        </div>

        {/* LOADING */}
        {loading && <p>Loading...</p>}

        {/* TASK LIST */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{task.title}</h3>

                <p
                  className={
                    task.status === "done"
                      ? "text-green-600"
                      : task.status === "late"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {task.status.toUpperCase()}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(task.deadline).toLocaleString()}
                </p>
              </div>

              {task.status !== "done" && (
                <button
                  onClick={() => markAsDone(task.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  ✔ Done
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}