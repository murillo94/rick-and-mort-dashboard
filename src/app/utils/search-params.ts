import { createLoader, parseAsString, parseAsInteger } from "nuqs/server";

export const debounceTime = 300;

export const searchParamKeys = {
  characters: "characters",
  page: "page",
};

export const searchParams = {
  [searchParamKeys.characters]: parseAsString
    .withDefault("")
    .withOptions({ shallow: false }),
  [searchParamKeys.page]: parseAsInteger
    .withDefault(1)
    .withOptions({ shallow: false }),
};

export const loadSearchParams = createLoader(searchParams);
