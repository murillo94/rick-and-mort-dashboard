import { forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps {
  slots: {
    start?: React.ReactNode;
    end?: React.ReactNode;
    input?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix">;
  };
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, slots = {} }, ref) => {
    const { start, end, input } = slots;

    return (
      <div
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-primary-600/15 bg-white p-2 text-sm text-primary-800 outline-none focus-within:ring-2 focus-within:ring-primary-400 transition-shadow",
          className
        )}
      >
        {start && (
          <div className="flex items-center text-primary-600">{start}</div>
        )}
        <input
          ref={ref}
          type="text"
          className={cn("flex-1 bg-transparent outline-none", input?.className)}
          {...input}
        />
        {end && <div className="flex items-center text-primary-600">{end}</div>}
      </div>
    );
  }
);

Input.displayName = "Input";
