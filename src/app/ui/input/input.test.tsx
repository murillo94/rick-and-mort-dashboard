import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { Input } from "./input";
import { createRef } from "react";

describe("Input", () => {
  describe("a11y", () => {
    it("should support aria attributes for screen readers", () => {
      render(
        <Input
          slots={{
            input: {
              "aria-label": "Username",
              "aria-required": true,
              required: true,
              "aria-invalid": true,
              disabled: true,
            },
          }}
        />
      );

      const input = screen.getByRole("textbox", { name: "Username" });

      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("aria-label", "Username");
      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toBeRequired();
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toBeDisabled();
    });

    it("should support aria-describedby for additional context", () => {
      render(
        <div>
          <Input
            slots={{
              input: {
                "aria-describedby": "help-text",
              },
            }}
          />
          <span id="help-text">Enter your email address</span>
        </div>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });

    it("should be keyboard accessible", async () => {
      const user = userEvent.setup();

      render(<Input slots={{ input: { placeholder: "Search characters" } }} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("placeholder", "Search characters");

      await user.tab();
      expect(input).toHaveFocus();

      await user.keyboard("Rick");
      expect(input).toHaveValue("Rick");
    });

    it("should associate with label using id", () => {
      render(
        <div>
          <label htmlFor="email-input">Email</label>
          <Input
            slots={{
              input: {
                id: "email-input",
              },
            }}
          />
        </div>
      );

      const input = screen.getByRole("textbox", { name: "Email" });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "email-input");
    });
  });

  describe("Slots", () => {
    it("should render start slot", () => {
      render(
        <Input
          slots={{
            start: <span data-testid="start-icon">🔍</span>,
          }}
        />
      );

      expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    });

    it("should render end slot", () => {
      render(
        <Input
          slots={{
            end: <button data-testid="clear-btn">Clear</button>,
          }}
        />
      );

      expect(screen.getByTestId("clear-btn")).toBeInTheDocument();
    });

    it("should render both start and end slots", () => {
      render(
        <Input
          slots={{
            start: <span data-testid="prefix">$</span>,
            end: <span data-testid="suffix">USD</span>,
          }}
        />
      );

      expect(screen.getByTestId("prefix")).toBeInTheDocument();
      expect(screen.getByTestId("suffix")).toBeInTheDocument();
    });

    it("should make interactive slot elements accessible", async () => {
      const user = userEvent.setup();
      const click = vi.fn();

      render(
        <Input
          slots={{
            end: (
              <button onClick={click} aria-label="Clear input">
                ✕
              </button>
            ),
          }}
        />
      );

      const button = screen.getByRole("button", { name: "Clear input" });
      await user.click(button);

      expect(click).toHaveBeenCalledTimes(1);
    });
  });

  describe("Functionality", () => {
    it("should support controlled input", async () => {
      const user = userEvent.setup();
      const change = vi.fn();

      render(
        <Input
          slots={{
            input: {
              value: "controlled",
              onChange: change,
            },
          }}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("controlled");

      await user.type(input, "a");
      expect(change).toHaveBeenCalled();
    });

    it("should support different input types", () => {
      render(
        <Input
          slots={{
            input: {
              type: "email",
            },
          }}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("should forward ref to input element", () => {
      const ref = createRef<HTMLInputElement>();

      render(<Input ref={ref} slots={{}} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current?.tagName).toBe("INPUT");
    });

    it("should apply custom className to wrapper", () => {
      const { container } = render(
        <Input className="custom-wrapper-class" slots={{}} />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass("custom-wrapper-class");
    });

    it("should apply custom className to input element", () => {
      render(
        <Input
          slots={{
            input: {
              className: "custom-input-class",
            },
          }}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-input-class");
    });
  });
});
