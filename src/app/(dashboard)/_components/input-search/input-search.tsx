"use client";

import { SearchIcon, XIcon } from "lucide-react";

import { Input } from "@/ui/input";
import { Button } from "@/ui/button";

import { useInputSearch } from "./use-input-search";

export const InputSearch = () => {
  const { state, handler } = useInputSearch();

  return (
    <Input
      slots={{
        start: (
          <SearchIcon
            data-testid="search-icon"
            aria-hidden
            className="size-4 text-slate-400"
          />
        ),
        input: {
          placeholder: "Search characters",
          value: state.searchParsed,
          onChange: (e) => {
            const value = e.target.value;
            handler.change(value);
          },
          onKeyPress: (e) => {
            if (e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              handler.change(value, false);
            }
          },
        },
        end:
          state.searchParsed.length > 0 ? (
            <Button
              iconOnly
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={handler.clear}
            >
              <XIcon data-testid="x-icon" aria-hidden className="size-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          ) : undefined,
      }}
    />
  );
};
