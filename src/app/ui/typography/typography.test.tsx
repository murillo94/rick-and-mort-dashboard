import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Typography, type TypographyVariant } from "./typography";

describe("Typography", () => {
  it.each([
    { variant: "title", expected: "heading" },
    { variant: "subtitle", expected: "heading" },
    { variant: "body", expected: "paragraph" },
    { variant: "caption", expected: "paragraph" },
    { variant: "small", expected: "paragraph" },
  ])("renders role($variant) -> $expected", ({ variant, expected }) => {
    render(
      <Typography variant={variant as TypographyVariant}>
        Rick Sanchez
      </Typography>
    );

    expect(screen.getByRole(expected)).toHaveTextContent("Rick Sanchez");
  });
});
