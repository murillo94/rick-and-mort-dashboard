import { useQueryStates, debounce } from "nuqs";

import {
  debounceTime,
  searchParamKeys,
  searchParams,
} from "@/utils/search-params";

export const useInputSearch = () => {
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

  const clear = () => {
    setSearch({
      [searchParamKeys.characters]: "",
      [searchParamKeys.page]: 1,
    });
  };

  return {
    state: {
      searchParsed,
    },
    handler: {
      change,
      clear,
    },
  };
};
