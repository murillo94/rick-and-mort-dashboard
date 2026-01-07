import { useCallback, useState, useTransition, useRef } from "react";
import { useQueryState, parseAsInteger } from "nuqs";

import { loadMoreCharacters } from "../../_actions/load-more-characters";
import { searchParamKeys } from "@/utils/search-params";

import type { Character, PaginationInfo } from "@/data-access/schemas";

export interface CharactersTableProps {
  initialData: Character[];
  paginationInfo: PaginationInfo;
  searchTerm: string;
}

export const useCharactersTable = ({
  initialData,
  paginationInfo,
  searchTerm,
}: CharactersTableProps) => {
  const [data, setData] = useState(initialData);
  const [info, setInfo] = useState(paginationInfo);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [, setPage] = useQueryState(
    searchParamKeys.page,
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );
  const lastLoadedPageRef = useRef<number>(1);

  const loadMore = useCallback(() => {
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

  const retry = useCallback(() => {
    setError(null);
    loadMore();
  }, [loadMore]);

  return {
    state: {
      data,
      info,
      isPending,
      error,
    },
    handler: {
      loadMore,
      retry,
    },
  };
};
