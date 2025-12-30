"use client";

import Image from "next/image";
import { forwardRef, useState } from "react";

import { cn } from "@/utils/cn";

const sizeClasses = {
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const fallbackSrc = "/fallback-avatar.png";

interface AvatarProps {
  alt: string;
  src?: string;
  initials?: string;
  size?: keyof typeof sizeClasses;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = "md", initials }, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    const onError = () => {
      if (imgSrc === src && fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(undefined);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold overflow-hidden",
          sizeClasses[size]
        )}
      >
        <ImageBase
          imgSrc={imgSrc}
          alt={alt}
          initials={initials}
          onError={onError}
        />
      </div>
    );
  }
);

interface ImageProps extends Pick<AvatarProps, "alt" | "initials"> {
  imgSrc?: string;
  onError?: () => void;
}

const ImageBase = ({ imgSrc, alt, initials, onError }: ImageProps) => {
  if (imgSrc) {
    return (
      <Image
        loading="eager"
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={onError}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  const showInitials = !imgSrc && initials;

  if (showInitials) {
    return <span className="select-none">{initials}</span>;
  }

  const showDefaultIcon = !initials;

  if (showDefaultIcon) {
    return (
      <Image
        src="/fallback-avatar.png"
        alt="Default Avatar"
        className="w-full h-full object-cover"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return null;
};

Avatar.displayName = "Avatar";
