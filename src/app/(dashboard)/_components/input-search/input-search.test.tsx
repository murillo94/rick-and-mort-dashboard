import {
  withNuqsTestingAdapter,
  type OnUrlUpdateFunction,
} from "nuqs/adapters/testing";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { InputSearch } from "./input-search";

vi.mock("lucide-react", () => ({
  SearchIcon: ({ className }: { className?: string }) => (
    <svg data-testid="search-icon" className={className} />
  ),
  XIcon: ({ className }: { className?: string }) => (
    <svg data-testid="x-icon" className={className} />
  ),
}));

describe("InputSearch", () => {
  it("should render the default attributes", () => {
    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter(),
    });

    const input = screen.getByPlaceholderText("Search characters");
    const searchIcon = screen.getByTestId("search-icon");
    const clearIcon = screen.queryByTestId("x-icon");

    expect(input).toHaveValue("");
    expect(input).toBeInTheDocument();
    expect(searchIcon).toBeInTheDocument();
    expect(clearIcon).not.toBeInTheDocument();
  });

  it("should render clear button when input has value", () => {
    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({ searchParams: "?characters=rick" }),
    });

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  it("should update search query state when typing", async () => {
    const user = userEvent.setup();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter(),
    });

    const input = screen.getByPlaceholderText("Search characters");
    await user.type(input, "rick");

    expect(input).toHaveValue("rick");
  });

  it("should debounce URL updates when typing", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        onUrlUpdate,
      }),
    });

    const input = screen.getByPlaceholderText("Search characters");
    await user.type(input, "rick");

    await waitFor(
      () => {
        expect(onUrlUpdate).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it("should reset page to 1 when searching", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?page=5",
        onUrlUpdate,
      }),
    });

    const input = screen.getByPlaceholderText("Search characters");
    await user.type(input, "morty");

    await waitFor(
      () => {
        expect(onUrlUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            searchParams: expect.any(URLSearchParams),
            options: expect.any(Object),
          })
        );
      },
      { timeout: 1000 }
    );

    const lastCall = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1];
    const searchParams = lastCall[0].searchParams;
    expect(searchParams.get("page")).toBeNull();
  });

  it("should reset page to 1 when clearing search", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?characters=rick&page=5",
        onUrlUpdate,
      }),
    });

    const clearButton = screen.getByRole("button");
    await user.click(clearButton);

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
    });

    const lastCall = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1];
    const searchParams = lastCall[0].searchParams;
    expect(searchParams.get("characters")).toBeNull();
    expect(searchParams.get("page")).toBeNull();
  });

  it("should trigger immediate search on Enter key press", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        onUrlUpdate,
      }),
    });

    const input = screen.getByPlaceholderText("Search characters");
    await user.type(input, "rick");

    onUrlUpdate.mockClear();

    await user.keyboard("{Enter}");

    await waitFor(
      () => {
        expect(onUrlUpdate).toHaveBeenCalled();
      },
      { timeout: 100 }
    );
  });

  it("should not debounce when clearing search", async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?characters=rick",
        onUrlUpdate,
      }),
    });

    const input = screen.getByPlaceholderText("Search characters");
    await user.clear(input);

    await waitFor(
      () => {
        expect(onUrlUpdate).toHaveBeenCalled();
      },
      { timeout: 100 }
    );
  });

  it("should clear search when clicking clear button", async () => {
    const user = userEvent.setup();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?characters=rick&page=3",
      }),
    });

    const input = screen.getByPlaceholderText("Search characters");
    expect(input).toHaveValue("rick");

    const clearButton = screen.getByRole("button");
    await user.click(clearButton);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("should hide clear button after clearing", async () => {
    const user = userEvent.setup();

    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?characters=rick",
      }),
    });

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();

    const clearButton = screen.getByRole("button");
    await user.click(clearButton);

    await waitFor(() => {
      expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    });
  });

  it("should initialize with value from URL search params", () => {
    render(<InputSearch />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: "?characters=summer",
      }),
    });

    const input = screen.getByPlaceholderText("Search characters");
    expect(input).toHaveValue("summer");
  });
});
