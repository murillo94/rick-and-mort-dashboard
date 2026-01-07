"use client";

import Link from "next/link";
import { ChartPie, TableProperties } from "lucide-react";

import { Button } from "@/ui/button";

import { useNav } from "./use-nav";

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
  const { handler } = useNav();

  return (
    <nav className="flex gap-2 w-full justify-start">
      {tabs.map((tab) => (
        <Button
          key={tab.href}
          variant={handler.isActive(tab.href) ? "secondary" : "ghost"}
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
