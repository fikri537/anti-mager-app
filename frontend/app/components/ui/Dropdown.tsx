"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function Dropdown({
  options,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find(
    (o) => o.value === value
  );

  return (
    <div className="relative">
      
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          px-5
          py-3
          text-white
          backdrop-blur-xl
        "
      >
        {selected?.label}

        <ChevronDown size={18} />
      </button>

      {/* MENU */}
      {open && (
        <div
          className="
            absolute
            left-0
            top-[110%]
            z-50
            min-w-[220px]
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#0f172a]
            shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="
                w-full
                px-5
                py-4
                text-left
                text-white/70
                transition-all
                hover:bg-white/[0.04]
                hover:text-white
              "
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}