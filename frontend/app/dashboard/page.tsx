"use client";

import { useEffect, useState } from "react";
import { getTasks, createTask } from "@/services/api";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchTasks = async () => {
    const data = await getTasks(token || "");
    setTasks(data);
  };

  const handleCreate = async () => {
    await createTask({ title, deadline }, token || "");
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* CREATE TASK */}
      <div className="space-x-2 mb-4">
        <input
          placeholder="Task title"
          className="border p-2"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="border p-2"
          onChange={(e) => setDeadline(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2"
        >
          Add Task
        </button>
      </div>

      {/* TASK LIST */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-3">
            <h2 className="font-bold">{task.title}</h2>
            <p>Status: {task.status}</p>
            <p>Penalty: {task.penalty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}