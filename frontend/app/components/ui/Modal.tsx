"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

export default function Modal({
  open,
  onClose,
  children,
  title,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-50
              bg-black/60
              backdrop-blur-sm
            "
          />

          {/* MODAL */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-50
              w-full
              max-w-lg
              -translate-x-1/2
              -translate-y-1/2
              rounded-[32px]
              border
              border-white/10
              bg-[#0f172a]
              p-8
              shadow-[0_20px_80px_rgba(0,0,0,0.5)]
            "
          >
            {title && (
              <h2 className="mb-6 text-2xl font-black">
                {title}
              </h2>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}