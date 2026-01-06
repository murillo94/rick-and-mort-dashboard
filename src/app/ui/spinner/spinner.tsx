"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/utils/cn";

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export type SpinnerSize = keyof typeof sizeClasses;

type SpinnerProps = {
  size?: SpinnerSize;
};

export const Spinner = ({ size = "md" }: SpinnerProps) => (
  <Loader2
    className={cn("size-4 animate-spin", sizeClasses[size])}
    aria-label="Loading"
  />
);
