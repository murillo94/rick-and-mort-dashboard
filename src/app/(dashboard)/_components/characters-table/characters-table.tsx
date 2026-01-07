"use client";

import { CharactersTableContent } from "./characters-table-content";
import {
  useCharactersTable,
  type CharactersTableProps,
} from "./use-characters-table";

const CharactersTableInner = (props: CharactersTableProps) => {
  const { state, handler } = useCharactersTable(props);

  return (
    <CharactersTableContent
      data={state.data}
      totalCount={state.info.count}
      hasNextPage={!!state.info.next}
      onLoadMore={handler.loadMore}
      isPending={state.isPending}
      error={state.error}
      onRetry={handler.retry}
    />
  );
};

export const CharactersTable = (props: CharactersTableProps) => {
  // Using key to reset state when search term changes
  return <CharactersTableInner key={props.searchTerm} {...props} />;
};
