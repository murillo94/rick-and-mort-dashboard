import type { ReactNode } from "react";

const variants = {
  title: {
    tag: "h1",
    className: "text-2xl font-bold text-primary-500",
  },
  subtitle: {
    tag: "h2",
    className: "text-lg font-medium text-primary-400",
  },
  body: {
    tag: "p",
    className: "text-base font-normal text-primary-500",
  },
  caption: {
    tag: "p",
    className: "text-sm font-normal text-primary-400",
  },
  small: {
    tag: "p",
    className: "text-xs font-normal text-primary-500",
  },
} satisfies Record<
  string,
  {
    tag: Extract<keyof HTMLElementTagNameMap, "h1" | "h2" | "p">;
    className: string;
  }
>;

export type TypographyVariant = keyof typeof variants;

interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
}

export const Typography = ({ variant, children }: TypographyProps) => {
  const { tag: Tag, className } = variants[variant];

  return <Tag className={className}>{children}</Tag>;
};
