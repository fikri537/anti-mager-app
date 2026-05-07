import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        `
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-2xl
        p-6
        shadow-[0_8px_40px_rgba(0,0,0,0.35)]
        transition-all
        duration-300
        `,
        className
      )}
    >
      {/* LIGHT BORDER */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />

      {children}
    </div>
  );
}