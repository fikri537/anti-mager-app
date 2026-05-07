import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "rounded-2xl px-5 py-3 font-semibold transition-all duration-300",
        "active:scale-[0.98]",
        {
          "bg-gradient-to-r from-cyan-400 to-violet-500 text-black hover:scale-[1.02]":
            variant === "primary",

          "bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]":
            variant === "secondary",

          "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20":
            variant === "danger",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}