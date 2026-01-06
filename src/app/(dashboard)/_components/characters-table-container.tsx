"use client";

import { useCallback, useState, useTransition, useRef } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { CharactersTable } from "./characters-table";
import { loadMoreCharacters } from "../_actions/load-more-characters";
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
  const [, setPage] = useQueryState(
    searchParamKeys.page,
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );
  const lastLoadedPageRef = useRef<number>(1);

  const handleLoadMore = useCallback(() => {
    if (!info.next || isPending || lastLoadedPageRef.current === info.next) {
      return;
    }

    startTransition(async () => {
      const nextPage = info.next!;
      lastLoadedPageRef.current = nextPage;

      const newData = await loadMoreCharacters({
        page: nextPage,
        filter: {
          name: searchTerm,
        },
      });

      await setPage(nextPage);

      setData((prev) => [...prev, ...newData.results]);
      setInfo(newData.info);
      window.scrollTo({ top: window.scrollY - 200, behavior: "instant" });
    });
  }, [info.next, isPending, setPage, searchTerm]);

  return (
    <CharactersTable
      data={data}
      totalCount={info.count}
      hasNextPage={!!info.next}
      onLoadMore={handleLoadMore}
      isPending={isPending}
    />
  );
}

export function CharactersTableContainer(props: CharactersTableContainerProps) {
  // Using key to reset state when search term changes
  return <CharactersTableInner key={props.searchTerm} {...props} />;
}
