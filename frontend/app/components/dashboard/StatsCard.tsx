"use client";

import Card from "../ui/Card";
import { motion } from "framer-motion";

type Props = {
  title: string;
  value: number | string;
  desc: string;
  color: string;

  // optional formatting control
  suffix?: string;
};

export default function StatsCard({
  title,
  value,
  desc,
  color,
  suffix,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
      }}
      className="h-full"
    >
      <Card
        className="
          relative
          overflow-hidden
          h-full
          group
          transition-all
          duration-300
          hover:border-cyan-400/20
        "
      >
        {/* GLOW EFFECT */}
        <div
          className="
            absolute
            top-0
            right-0
            w-32
            h-32
            bg-cyan-400/10
            blur-3xl
            rounded-full
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-500
          "
        />

        {/* CONTENT */}
        <div className="relative z-10">
          
          {/* HEADER */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/40 tracking-wide">
                {title}
              </p>

              <h2 className={`text-5xl font-black mt-4 tracking-tight ${color}`}>
                {value}
                {suffix && (
                  <span className="text-3xl ml-1 opacity-80">
                    {suffix}
                  </span>
                )}
              </h2>
            </div>

            {/* MINI INDICATOR */}
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.7)]" />
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-white/40 leading-relaxed">
              {desc}
            </p>

            <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/50">
              Live
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}