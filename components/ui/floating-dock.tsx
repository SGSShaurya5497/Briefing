"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  className?: string;
}

const MAGNIFICATION = 60;
const DISTANCE = 120;
const BASE_SIZE = 44;

// ─── Individual Dock Icon ─────────────────────────────────────────────────────

function DockIcon({
  item,
  mouseX,
}: {
  item: DockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [BASE_SIZE, MAGNIFICATION, BASE_SIZE]
  );

  const width = useSpring(widthSync, { stiffness: 300, damping: 30 });

  return (
    <a href={item.href}>
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        className="relative flex aspect-square items-center justify-center rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      >
        {/* Icon */}
        <div className="flex h-[60%] w-[60%] items-center justify-center">
          {item.icon}
        </div>

        {/* Tooltip */}
        <motion.div
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg"
          initial={false}
        >
          {item.title}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
        </motion.div>
      </motion.div>
    </a>
  );
}

// ─── Floating Dock ────────────────────────────────────────────────────────────

export function FloatingDock({ items, className }: FloatingDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-16 items-end gap-3 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-200 px-4 pb-3 shadow-xl shadow-neutral-200/50",
        className
      )}
    >
      {items.map((item) => (
        <DockIcon key={item.title} item={item} mouseX={mouseX} />
      ))}
    </motion.div>
  );
}
