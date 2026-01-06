import { Suspense } from "react";

import { InputSearch } from "./_components/input-search";
import { CharactersTableContainer } from "./_components/characters-table-container";
import { LoadingCard } from "./_components/loading";

import { getCharacters } from "@/data-access/services";
import { loadSearchParams } from "@/utils/search-params";

import type { SearchParams } from "nuqs/server";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function List({ searchParams }: PageProps) {
  const { characters: searchTerm, page } = await loadSearchParams(searchParams);

  const searchTermParsed = String(searchTerm);
  const { characters } = await getCharacters({
    page: Number(page),
    filter: {
      name: searchTermParsed,
    },
  });

  const { results, info } = characters;

  return (
    <div className="flex flex-col gap-4 w-full">
      <InputSearch />
      <Suspense
        fallback={
          <div className="bg-white rounded-lg p-6 border border-slate-200 w-full">
            <LoadingCard message="Loading characters..." />
          </div>
        }
      >
        <CharactersTableContainer
          initialData={results}
          paginationInfo={info}
          searchTerm={searchTermParsed}
        />
      </Suspense>
    </div>
  );
}
