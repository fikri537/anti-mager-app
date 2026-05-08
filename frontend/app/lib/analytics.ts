import { Task } from "@/services/task.service";

export type WeeklyData = {
  day: string;
  done: number;
  focus: number;
};

export function buildWeeklyData(tasks: Task[]): WeeklyData[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const map: WeeklyData[] = days.map((d) => ({
    day: d,
    done: 0,
    focus: 0,
  }));

  tasks.forEach((task) => {
    if (!task?.deadline) return;

    const date = new Date(task.deadline);
    if (isNaN(date.getTime())) return;

    const dayIndex = date.getDay();
    const status = (task.status || "").toLowerCase();

    if (status === "done") {
      map[dayIndex].done += 1;
    }

    if (status !== "late") {
      map[dayIndex].focus += 1;
    }
  });

  return map;
}