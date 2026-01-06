"use client";

import { useCallback, useState, useTransition, useRef } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { CharactersTable } from "./characters-table";
import { loadMoreCharacters } from "../../_actions/load-more-characters";
import { searchParamKeys } from "@/utils/search-params";
import type { Character, PaginationInfo } from "@/data-access/schemas";

type CharactersTableContainerProps = {
  initialData: Character[];
  paginationInfo: PaginationInfo;
  searchTerm: string;
};

function CharactersTableInner({
  initialData,
  paginationInfo,
  searchTerm,
}: CharactersTableContainerProps) {
  const [data, setData] = useState(initialData);
  const [info, setInfo] = useState(paginationInfo);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [, setPage] = useQueryState(
    searchParamKeys.page,
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );
  const lastLoadedPageRef = useRef<number>(1);

  const handleLoadMore = useCallback(() => {
    if (!info.next || isPending || lastLoadedPageRef.current === info.next) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const nextPage = info.next!;
      lastLoadedPageRef.current = nextPage;

      const result = await loadMoreCharacters({
        page: nextPage,
        filter: {
          name: searchTerm,
        },
      });

      if (result.success) {
        await setPage(nextPage);
        setData((prev) => [...prev, ...result.results]);
        setInfo({
          count: result.info.count,
          pages: result.info.pages,
          next: result.info.next ?? 0,
          prev: result.info.prev ?? 0,
        });
        window.scrollTo({ top: window.scrollY - 200, behavior: "instant" });
      } else {
        setError(result.error);
        lastLoadedPageRef.current = nextPage - 1;
      }
    });
  }, [info.next, isPending, setPage, searchTerm]);

  const handleRetry = useCallback(() => {
    setError(null);
    handleLoadMore();
  }, [handleLoadMore]);

  return (
    <CharactersTable
      data={data}
      totalCount={info.count}
      hasNextPage={!!info.next}
      onLoadMore={handleLoadMore}
      isPending={isPending}
      error={error}
      onRetry={handleRetry}
    />
  );
}

export function CharactersTableContainer(props: CharactersTableContainerProps) {
  // Using key to reset state when search term changes
  return <CharactersTableInner key={props.searchTerm} {...props} />;
}
