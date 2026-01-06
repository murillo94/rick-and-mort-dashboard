import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("should render with aria-label", () => {
    render(<Spinner />);

    const spinner = screen.getByLabelText("Loading");

    expect(spinner).toBeInTheDocument();
  });
});
