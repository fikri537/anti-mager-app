type Props = {
  name: string;
  size?: "sm" | "md" | "lg";
};

export default function Avatar({
  name,
  size = "md",
}: Props) {
  const initial = name.charAt(0).toUpperCase();

  const sizes = {
    sm: "h-10 w-10 text-sm",
    md: "h-14 w-14 text-lg",
    lg: "h-20 w-20 text-2xl",
  };

  return (
    <div
      className={`
        ${sizes[size]}
        flex
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-br
        from-cyan-400
        to-violet-500
        font-black
        text-black
        shadow-[0_0_30px_rgba(34,211,238,0.35)]
      `}
    >
      {initial}
    </div>
  );
}