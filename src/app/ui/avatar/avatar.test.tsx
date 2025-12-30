import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { Avatar } from "./avatar";
import { createRef } from "react";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onError,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img src={src} alt={alt} onError={onError} {...props} />;
  },
}));

describe("Avatar", () => {
  it("should have role, alt and aria-label", () => {
    render(<Avatar src="/test.jpg" alt="John Doe" />);

    const avatar = screen.getByRole("img", { name: "John Doe" });
    expect(avatar).toHaveAttribute("src", "/test.jpg");
    expect(avatar).toHaveAttribute("loading", "eager");
  });

  it("should show initials when no src is provided", () => {
    render(<Avatar alt="John Doe" initials="JD" />);

    const initials = screen.getByText("JD");
    expect(initials).toHaveClass("select-none");
  });

  it("should fallback to fallback image on error", () => {
    render(<Avatar src="/broken-image.jpg" alt="User avatar" />);

    const image = screen.getByAltText("User avatar");

    fireEvent.error(image);

    expect(image).toHaveAttribute("src", "/fallback-avatar.png");
  });

  it("should show initials after fallback image fails", () => {
    render(<Avatar src="/broken-image.jpg" alt="User avatar" initials="AB" />);

    const image = screen.getByAltText("User avatar");

    fireEvent.error(image);
    expect(image).toHaveAttribute("src", "/fallback-avatar.png");

    fireEvent.error(image);

    const initials = screen.getByText("AB");
    expect(initials).toBeInTheDocument();
  });

  it("should forward ref to container div", () => {
    const ref = createRef<HTMLDivElement>();

    render(<Avatar ref={ref} src="/test.jpg" alt="User" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("should handle empty initials string", () => {
    render(<Avatar alt="User" />);

    const fallbackImage = screen.getByAltText("Default Avatar");
    expect(fallbackImage).toBeInTheDocument();
  });

  it("should handle undefined src", () => {
    render(<Avatar alt="User" initials="XY" />);

    const initials = screen.getByText("XY");
    expect(initials).toBeInTheDocument();
  });
});
