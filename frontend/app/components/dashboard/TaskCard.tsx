"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";

import Button from "../ui/Button";
import Card from "../ui/Card";

type Task = {
  id: number;
  title: string;
  status: "pending" | "done" | "late";
  deadline: string;
};

type Props = {
  task: Task;
  onDone: () => void;
  onDelete: () => void;
};

export default function TaskCard({
  task,
  onDone,
  onDelete,
}: Props) {
  const getStatusColor = () => {
    if (task.status === "done") {
      return {
        dot: "bg-emerald-400",
        badge:
          "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      };
    }

    if (task.status === "late") {
      return {
        dot: "bg-red-400",
        badge:
          "bg-red-500/10 border-red-500/20 text-red-400",
      };
    }

    return {
      dot: "bg-amber-400",
      badge:
        "bg-amber-500/10 border-amber-500/20 text-amber-400",
    };
  };

  const colors = getStatusColor();

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <Card
        className="
          group
          hover:bg-white/[0.05]
          hover:border-cyan-400/10
        "
      >
        {/* GLOW */}
        <div
          className="
            absolute
            right-0
            top-0
            h-40
            w-40
            rounded-full
            bg-cyan-400/5
            blur-3xl
            opacity-0
            transition-all
            duration-500
            group-hover:opacity-100
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            gap-6
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
        >
          {/* LEFT */}
          <div className="flex items-start gap-4">
            
            {/* STATUS DOT */}
            <div
              className={`
                mt-2
                h-4
                w-4
                rounded-full
                shadow-[0_0_20px_rgba(255,255,255,0.4)]
                ${colors.dot}
              `}
            />

            {/* CONTENT */}
            <div>
              <h2
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-white
                "
              >
                {task.title}
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                
                {/* STATUS */}
                <div
                  className={`
                    rounded-2xl
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    capitalize
                    ${colors.badge}
                  `}
                >
                  {task.status}
                </div>

                {/* DEADLINE */}
                <div
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-4
                    py-2
                    text-sm
                    text-white/70
                  "
                >
                  {format(
                    new Date(task.deadline),
                    "dd MMM yyyy, HH:mm"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {task.status !== "done" && (
              <Button onClick={onDone}>
                Complete
              </Button>
            )}

            <Button
              variant="danger"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}