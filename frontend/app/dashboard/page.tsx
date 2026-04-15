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

  const data = await getTasks(token);
  setTasks(data);
};

const getScore = (task: Task) => {
  if (task.status === "done") return 10;
  if (task.status === "late") return -5;
  return 0;
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
        <li key={task.id} className="border p-3 flex justify-between">
            <div>
                <h2 className="font-bold">{task.title}</h2>
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
                <p>Score: {getScore(task)}</p>
            </div>

            {task.status !== "done" && (
                <button
                    onClick={() => markAsDone(task.id)}
                    className="bg-green-600 text-white px-3 py-1"
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