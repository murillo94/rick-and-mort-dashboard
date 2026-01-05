import React from "react";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  iconOnly?: boolean;
  slots?: {
    start?: React.ReactNode;
    end?: React.ReactNode;
  };
  isLoading?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
}

const variantClasses = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 disabled:bg-primary-300",
  secondary:
    "bg-primary-100 text-primary-800 hover:bg-primary-200 focus-visible:ring-primary-500 disabled:bg-primary-50 disabled:text-primary-400",
  outline:
    "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300",
  ghost:
    "text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 disabled:text-primary-300",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const iconOnlySizeClasses = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-3",
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const LoadingSpinner = ({ size }: Required<Pick<ButtonProps, "size">>) => (
  <Loader2 className={cn("size-4 animate-spin", iconSizeClasses[size])} />
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      iconOnly = false,
      slots = {},
      isLoading = false,
      asChild = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const buttonClasses = cn(
      "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-60",
      variantClasses[variant],
      iconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
      className
    );

    const renderContent = (childContent?: React.ReactNode) => {
      if (isLoading) {
        return <LoadingSpinner size={size} />;
      }

      return (
        <>
          {slots.start && (
            <span className={cn("flex-shrink-0", iconSizeClasses[size])}>
              {slots.start}
            </span>
          )}
          {!iconOnly && childContent}
          {slots.end && (
            <span className={cn("flex-shrink-0", iconSizeClasses[size])}>
              {slots.end}
            </span>
          )}
          {iconOnly && childContent}
        </>
      );
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<ButtonProps>;

      return React.cloneElement(child, {
        className: cn(buttonClasses, child.props?.className ?? ""),
        disabled: isDisabled,
        ...props,
        children: renderContent(child.props.children),
      });
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={buttonClasses}
        {...props}
      >
        {renderContent(children)}
      </button>
    );
  }
);

Button.displayName = "Button";
