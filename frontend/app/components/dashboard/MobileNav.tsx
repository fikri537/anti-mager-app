"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  Settings,
} from "lucide-react";

const items = [
  {
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    icon: Trophy,
    href: "/leaderboard",
  },
  {
    icon: BarChart3,
    href: "/analytics",
  },
  {
    icon: Settings,
    href: "/settings",
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed
        bottom-5
        left-1/2
        z-50
        flex
        -translate-x-1/2
        items-center
        gap-2
        rounded-3xl
        border
        border-white/10
        bg-black/40
        p-2
        backdrop-blur-2xl
        xl:hidden
      "
    >
      {items.map((item) => {
        const Icon = item.icon;

        const active =
          pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              transition-all
              duration-300

              ${
                active
                  ? `
                    bg-gradient-to-br
                    from-cyan-400
                    to-violet-500
                    text-black
                  `
                  : `
                    text-white/40
                    hover:text-white
                  `
              }
            `}
          >
            <Icon size={22} />
          </Link>
        );
      })}
    </div>
  );
}