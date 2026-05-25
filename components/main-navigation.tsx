"use client";

import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconHome,
  IconPhotoStar,
  IconLayoutGrid,
  IconBrandGithub,
} from "@tabler/icons-react";

const links = [
  {
    title: "Home",
    icon: <IconHome className="h-full w-full text-neutral-500" />,
    href: "/",
  },
  {
    title: "Swap Tiles",
    icon: <IconPhotoStar className="h-full w-full text-neutral-500" />,
    href: "/app",
  },
  {
    title: "My Gallery",
    icon: <IconLayoutGrid className="h-full w-full text-neutral-500" />,
    href: "/gallery",
  },
  {
    title: "GitHub",
    icon: <IconBrandGithub className="h-full w-full text-neutral-500" />,
    href: "https://github.com",
  },
];

export function MainNavigation() {
  return (
    <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <FloatingDock items={links} />
    </div>
  );
}
