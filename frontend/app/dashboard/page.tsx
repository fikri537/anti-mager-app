"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import StatsCard from "../components/dashboard/StatsCard";
import ProductivityChart from "../components/dashboard/ProductivityChart";
import QuickCreate from "../components/dashboard/QuickCreate";
import TaskCard from "../components/dashboard/TaskCard";
import MobileNav from "../components/dashboard/MobileNav";
import ProductivityInsight from "../components/dashboard/ProductivityInsight";

import PageTransition from "../components/ui/PageTransition";
import Modal from "../components/ui/Modal";
import TaskFilter from "../components/dashboard/TaskFilter";

import {
  getTasks,
  createTask as createTaskAPI,
  updateTask,
  deleteTask as deleteTaskAPI,
  Task,
} from "@/services/task.service";

type FilterType = "all" | "done" | "pending" | "late";

type TaskWithMeta = Task & {
  completed_at?: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<TaskWithMeta[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterType>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /**
   * =========================
   * NORMALIZER
   * =========================
   */
  const normalizeTask = (task: TaskWithMeta): TaskWithMeta => {
    const isLate =
      task.status !== "done" &&
      new Date(task.deadline).getTime() < Date.now();

    return {
      ...task,
      status: isLate ? "late" : task.status,
    };
  };

  /**
   * =========================
   * FETCH TASKS
   * =========================
   */
  const fetchTasks = async (authToken: string) => {
    try {
      setLoading(true);

      const res = await getTasks(authToken);
      const raw = res?.data ?? res;

      if (!Array.isArray(raw)) {
        setTasks([]);
        return;
      }

      const normalized = raw.map(normalizeTask);

      setTasks(normalized);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * =========================
   * AUTH
   * =========================
   */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.replace("/login");
      return;
    }

    setToken(storedToken);
    fetchTasks(storedToken);
  }, [router]);

  /**
   * =========================
   * STATS
   * =========================
   */
  const stats = useMemo(() => {
    const total = tasks.length;

    const done = tasks.filter((t) => t.status === "done").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const late = tasks.filter((t) => t.status === "late").length;

    const score = tasks.reduce((acc, t) => {
      if (t.status === "done") return acc + 10;
      if (t.status === "late") return acc - 5;
      return acc;
    }, 0);

    return { total, done, pending, late, score };
  }, [tasks]);

  const completionRate =
    stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  /**
   * =========================
   * FILTER (SAFE + CONSISTENT)
   * =========================
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "all") return true;

      if (filter === "done") {
        return t.status === "done" && !!t.completed_at;
      }

      if (filter === "pending") {
        return t.status === "pending" && !t.completed_at;
      }

      if (filter === "late") {
        return t.status === "late";
      }

      return true;
    });
  }, [tasks, filter]);

  /**
   * =========================
   * CREATE TASK
   * =========================
   */
  const createTask = async () => {
    if (!title.trim() || !deadline) {
      toast.error("Please complete all fields");
      return;
    }

    if (!token) return;

    try {
      setSubmitting(true);

      await createTaskAPI(
        { title: title.trim(), deadline },
        token
      );

      await fetchTasks(token);

      setTitle("");
      setDeadline("");

      toast.success("Task created successfully 🚀");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * =========================
   * COMPLETE TASK (SET completed_at)
   * =========================
   */
  const completeTask = async (id: number) => {
    if (!token) return;

    try {
      await updateTask(id, "done", token);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status: "done",
                completed_at: new Date().toISOString(),
              }
            : t
        )
      );

      toast.success("Task completed successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    }
  };

  /**
   * =========================
   * DELETE TASK
   * =========================
   */
  const deleteTask = async (id: number) => {
    if (!token) return;

    try {
      await deleteTaskAPI(id, token);

      setTasks((prev) => prev.filter((t) => t.id !== id));

      toast.success("Task deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

  /**
   * =========================
   * UI
   * =========================
   */
  return (
    <PageTransition>
      <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">

        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[120px]" />
        </div>

        <div className="relative flex">

          <Sidebar />

          <main className="flex-1 p-5 pb-32 lg:p-8">

            <Topbar />

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4"
            >
              <StatsCard title="Total Tasks" value={stats.total} desc="All active tasks" color="text-cyan-400" />
              <StatsCard title="Completed" value={stats.done} desc="Finished tasks" color="text-emerald-400" />
              <StatsCard title="Pending" value={stats.pending} desc="Still in progress" color="text-amber-400" />
              <StatsCard title="Late Tasks" value={stats.late} desc="Need attention" color="text-red-400" />
            </motion.div>

            {/* CHART */}
            <div className="mt-8 grid grid-cols-1 gap-6 2xl:grid-cols-3">
              <div className="2xl:col-span-2">
                <ProductivityChart />
              </div>

              <QuickCreate
                title={title}
                setTitle={setTitle}
                deadline={deadline}
                setDeadline={setDeadline}
                onCreate={createTask}
                loading={submitting}
              />
            </div>

            {/* INSIGHT */}
            <div className="mt-6">
              <ProductivityInsight
                completionRate={completionRate}
                score={stats.score}
              />
            </div>

            {/* FILTER */}
            <div className="mt-8">
              <TaskFilter value={filter} onChange={setFilter} />
            </div>

            {/* TASK LIST */}
            <div className="mt-8">
              {loading ? (
                <div className="glass-card rounded-[32px] p-10 text-center text-white/50">
                  Loading tasks...
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="glass-card rounded-[32px] p-16 text-center">
                  <h2 className="text-3xl font-black">No tasks yet</h2>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-5">
                    {filteredTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDone={() => completeTask(task.id)}
                        onDelete={() => setDeleteId(task.id)}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </div>

          </main>
        </div>

        {/* DELETE MODAL */}
        <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Task">
          <p>Are you sure?</p>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setDeleteId(null)}>Cancel</button>
            <button
              onClick={() => {
                if (deleteId) deleteTask(deleteId);
                setDeleteId(null);
              }}
              className="text-red-400"
            >
              Delete
            </button>
          </div>
        </Modal>

        <MobileNav />
      </div>
    </PageTransition>
  );
}