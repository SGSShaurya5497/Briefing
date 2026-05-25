"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame,
  wrap,
} from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DraggableCardContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface DraggableCardBodyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Container ────────────────────────────────────────────────────────────────

export function DraggableCardContainer({
  children,
  className,
}: DraggableCardContainerProps) {
  return (
    <div className={className} style={{ perspective: "1000px" }}>
      {children}
    </div>
  );
}

// ─── Card Body ────────────────────────────────────────────────────────────────

export function DraggableCardBody({
  children,
  className,
  style,
}: DraggableCardBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Drag values
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  // Smooth spring for tilt
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set((e.clientX - cx) / (rect.width / 2));
    mouseY.set((e.clientY - cy) / (rect.height / 2));
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      drag
      dragElastic={0.18}
      dragTransition={{ bounceStiffness: 250, bounceDamping: 25 }}
      whileDrag={{ scale: 1.04, zIndex: 50 }}
      style={{
        x: dragX,
        y: dragY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
