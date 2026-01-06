"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useQueryStates, debounce } from "nuqs";

import { Input } from "@/ui/input";
import { Button } from "@/ui/button";

import {
  debounceTime,
  searchParamKeys,
  searchParams,
} from "@/utils/search-params";

export const InputSearch = () => {
  const [search, setSearch] = useQueryStates(searchParams);

  const searchParsed = String(search[searchParamKeys.characters]) ?? "";

  const change = (value: string, canDebounce?: boolean) => {
    setSearch(
      {
        [searchParamKeys.characters]: value,
        [searchParamKeys.page]: 1,
      },
      {
        limitUrlUpdates: canDebounce ? debounce(debounceTime) : undefined,
      }
    );
  };

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
          value: searchParsed,
          onChange: (e) => {
            const value = e.target.value;
            setSearch(
              {
                [searchParamKeys.characters]: value,
                [searchParamKeys.page]: 1,
              },
              {
                limitUrlUpdates:
                  value === "" ? undefined : debounce(debounceTime),
              }
            );
          },
          onKeyPress: (e) => {
            if (e.key === "Enter") {
              const value = (e.target as HTMLInputElement).value;
              change(value, false);
            }
          },
        },
        end:
          searchParsed.length > 0 ? (
            <Button
              iconOnly
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => {
                setSearch({
                  [searchParamKeys.characters]: "",
                  [searchParamKeys.page]: 1,
                });
              }}
            >
              <XIcon data-testid="x-icon" aria-hidden className="size-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          ) : undefined,
      }}
    />
  );
};
