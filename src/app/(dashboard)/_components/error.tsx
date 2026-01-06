"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { Button } from "@/ui/button";

import { cn } from "@/utils/cn";

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage = ({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorMessageProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-4 py-8 px-4",
      className
    )}
    role="alert"
  >
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
      <AlertCircle className="w-6 h-6 text-red-600" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md">{message}</p>
    </div>
    {onRetry && (
      <Button onClick={onRetry} variant="primary" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
);

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorCard = ({
  title = "Failed to load data",
  message = "We couldn't load the requested data. Please try again later.",
  onRetry,
}: ErrorCardProps) => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <ErrorMessage title={title} message={message} onRetry={onRetry} />
  </div>
);

interface InlineErrorProps {
  message: string;
  className?: string;
}

export const InlineError = ({ message, className }: InlineErrorProps) => (
  <div
    className={cn(
      "flex items-center gap-2 text-red-600 text-sm py-2",
      className
    )}
    role="alert"
  >
    <AlertCircle className="w-4 h-4 flex-shrink-0" />
    <span>{message}</span>
  </div>
);
