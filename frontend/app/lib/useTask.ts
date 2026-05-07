"use client";

import { useEffect, useState } from "react";
import { getTasks, Task } from "@/services/task.service";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getTasks(token);

      setTasks(res.data || []);
    } catch (err) {
      console.error("useTasks error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, refetch: fetchTasks };
}