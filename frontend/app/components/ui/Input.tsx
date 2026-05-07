import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className,
  ...props
}: Props) {
  return (
    <input
      className={clsx(
        "w-full rounded-2xl",
        "bg-white/[0.04]",
        "border border-white/10",
        "px-5 py-4",
        "outline-none",
        "transition-all duration-300",
        "focus:border-cyan-400",
        "focus:ring-4 focus:ring-cyan-400/10",
        "placeholder:text-white/30",
        className
      )}
      {...props}
    />
  );
}