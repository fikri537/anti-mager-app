import clsx from "clsx";

type Variant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

export default function Badge({
  children,
  variant = "default",
  className,
}: Props) {
  return (
    <div
      className={clsx(
        `
        inline-flex
        items-center
        rounded-2xl
        border
        px-4
        py-2
        text-sm
        font-medium
        backdrop-blur-xl
        `,
        {
          "border-white/10 bg-white/[0.04] text-white/70":
            variant === "default",

          "border-emerald-500/20 bg-emerald-500/10 text-emerald-400":
            variant === "success",

          "border-amber-500/20 bg-amber-500/10 text-amber-400":
            variant === "warning",

          "border-red-500/20 bg-red-500/10 text-red-400":
            variant === "danger",

          "border-cyan-500/20 bg-cyan-500/10 text-cyan-400":
            variant === "info",
        },
        className
      )}
    >
      {children}
    </div>
  );
}