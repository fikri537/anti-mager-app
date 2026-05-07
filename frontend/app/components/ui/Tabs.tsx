"use client";

type Tab = {
  label: string;
  value: string;
};

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
};

export default function Tabs({
  tabs,
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            rounded-2xl
            border
            px-5
            py-3
            text-sm
            font-medium
            transition-all
            duration-300

            ${
              active === tab.value
                ? `
                  border-transparent
                  bg-gradient-to-r
                  from-cyan-400
                  to-violet-500
                  font-bold
                  text-black
                `
                : `
                  border-white/10
                  bg-white/[0.03]
                  text-white/60
                  hover:bg-white/[0.06]
                  hover:text-white
                `
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}