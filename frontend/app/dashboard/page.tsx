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

      const data = await getTasks(tkn);

      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks) {
        setTasks(data.tasks);
      } else {
        console.error("Invalid response:", data);
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

    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status: "done" }),
      });

      await fetchTasks(token);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const getScore = (task: Task) => {
    if (task.status === "done") return 10;
    if (task.status === "late") return -5;
    return 0;
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const late = tasks.filter((t) => t.status === "late").length;
  const score = tasks.reduce((acc, t) => acc + getScore(t), 0);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* NAV */}
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">🔥 Dashboard</h1>
        <a href="/leaderboard" className="text-blue-600">
          Leaderboard →
        </a>
      </div>

      {/* CREATE TASK */}
      <div className="space-y-2 mb-6">
        <input
          placeholder="Task title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Add Task
        </button>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="border p-3 rounded">Total: {total}</div>
        <div className="border p-3 rounded">Done: {done}</div>
        <div className="border p-3 rounded">Late: {late}</div>
        <div className="border p-3 rounded font-bold">
          Score: {score}
        </div>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* TASK LIST */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-4 rounded-lg shadow-sm flex justify-between items-center"
          >
            <div>
              <h2 className="font-bold text-lg">{task.title}</h2>

              <p
                className={
                  task.status === "done"
                    ? "text-green-600"
                    : task.status === "late"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                Status: {task.status}
              </p>

              <p>Penalty: {task.penalty}</p>

              <p className="text-sm text-gray-500">
                {new Date(task.deadline).toLocaleString()}
              </p>

              <p className="font-semibold">
                Score: {getScore(task)}
              </p>
            </div>

            {task.status !== "done" && (
              <button
                onClick={() => markAsDone(task.id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Done
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}