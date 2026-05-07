"use client";

import Card from "../ui/Card";
import Button from "../ui/Button";

import {
  Sparkles,
  CalendarDays,
  ClipboardPen,
} from "lucide-react";

type Props = {
  title: string;
  setTitle: (
    value: string
  ) => void;

  deadline: string;
  setDeadline: (
    value: string
  ) => void;

  onCreate: () => void;

  loading?: boolean;
};

export default function QuickCreate({
  title,
  setTitle,
  deadline,
  setDeadline,
  onCreate,
  loading = false,
}: Props) {
  return (
    <Card className="relative overflow-hidden">
      
      {/* BACKGROUND GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          right-[-40px]
          top-[-40px]
          h-40
          w-40
          rounded-full
          bg-cyan-400/10
          blur-3xl
        "
      />

      {/* HEADER */}
      <div className="relative z-10">
        
        <div className="flex items-center gap-3">
          
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-cyan-400/20
              to-violet-500/20
            "
          >
            <Sparkles
              size={22}
              className="text-cyan-400"
            />
          </div>

          <div>
            <p className="text-sm text-cyan-400">
              Quick Create
            </p>

            <h2 className="text-2xl font-black">
              New Task
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-white/40">
          Create and schedule your next
          productive mission instantly.
        </p>
      </div>

      {/* FORM */}
      <div className="relative z-10 mt-8 space-y-5">
        
        {/* TITLE */}
        <div>
          <label className="mb-2 block text-sm text-white/50">
            Task Title
          </label>

          <div className="relative">
            
            <ClipboardPen
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-white/30
              "
            />

            <input
              type="text"
              placeholder="Build next big feature..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              disabled={loading}
              className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                pl-12
                pr-4
                text-white
                outline-none
                transition-all
                placeholder:text-white/20
                focus:border-cyan-400/40
                focus:bg-white/[0.05]
              "
            />
          </div>
        </div>

        {/* DEADLINE */}
        <div>
          <label className="mb-2 block text-sm text-white/50">
            Deadline
          </label>

          <div className="relative">
            
            <CalendarDays
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-white/30
              "
            />

            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
              disabled={loading}
              className="
                h-14
                w-full
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                pl-12
                pr-4
                text-white
                outline-none
                transition-all
                focus:border-cyan-400/40
                focus:bg-white/[0.05]
              "
            />
          </div>
        </div>

        {/* BUTTON */}
        <Button
          onClick={onCreate}
          disabled={loading}
          className="w-full"
        >
          {loading
            ? "Creating Task..."
            : "Create Task"}
        </Button>
      </div>
    </Card>
  );
}