import { cn } from "@/utils/cn";
import { Spinner, type SpinnerSize } from "@/ui/spinner";

interface LoadingProps {
  message?: string;
  size?: SpinnerSize;
  className?: string;
}

export const Loading = ({ message, size = "md", className }: LoadingProps) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-3 py-8",
      className
    )}
  >
    <Spinner size={size} />
    {message && (
      <p className="text-sm text-primary-600 font-medium">{message}</p>
    )}
  </div>
);

type LoadingCardProps = {
  message?: string;
};

export const LoadingCard = ({ message = "Loading..." }: LoadingCardProps) => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <Loading message={message} size="lg" />
  </div>
);
