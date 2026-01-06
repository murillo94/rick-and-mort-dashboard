"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartPie, TableProperties } from "lucide-react";

import { Button } from "@/ui/button";

const tabs = [
  {
    name: "List",
    href: "/",
    icon: TableProperties,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ChartPie,
  },
];

export const Nav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      // Match "/" and any "/[id]" routes (e.g., "/1", "/2", etc.)
      return pathname === "/" || /^\/\d+$/.test(pathname);
    }

    return pathname === href;
  };

  return (
    <nav className="flex gap-2">
      {tabs.map((tab) => (
        <Button
          key={tab.href}
          variant={isActive(tab.href) ? "secondary" : "ghost"}
          size="sm"
          slots={{ start: <tab.icon className="size-4 text-primary-600" /> }}
          asChild
        >
          <Link href={tab.href}>{tab.name}</Link>
        </Button>
      ))}
    </nav>
  );
};
