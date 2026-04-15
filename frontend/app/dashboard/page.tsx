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

  // 🔐 AUTH CHECK + LOAD TOKEN
  useEffect(() => {
    const t = localStorage.getItem("token");

    if (!t) {
      router.push("/login");
      return;
    }

    setToken(t);
  }, [router]);

  // 📦 FETCH TASKS
  useEffect(() => {
    if (!token) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);

        const data = await getTasks(token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  // ➕ CREATE TASK
  const handleCreate = async () => {
    if (!token) return;
    if (!title || !deadline) return;

    try {
      await createTask(
        {
          title,
          deadline,
        },
        token
      );

      const data = await getTasks(token);
      setTasks(data);

      setTitle("");
      setDeadline("");
    } catch (err) {
      console.error("Create task error:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* CREATE TASK */}
      <div className="space-x-2 mb-6">
        <input
          placeholder="Task title"
          className="border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="border p-2"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2"
        >
          Add Task
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && <p>Loading tasks...</p>}

      {/* TASK LIST */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-3">
            <h2 className="font-bold">{task.title}</h2>
            <p>Status: {task.status}</p>
            <p>Penalty: {task.penalty}</p>
            <p className="text-sm text-gray-500">
              Deadline: {new Date(task.deadline).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}