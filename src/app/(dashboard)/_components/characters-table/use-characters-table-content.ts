import { Character } from "@/data-access/schemas";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

export interface CharactersTableContentProps {
  data: Character[];
  totalCount: number;
  hasNextPage: boolean;
  isPending: boolean;
  error?: string | null;
  onLoadMore: () => void;
  onRetry: () => void;
}

export const useCharactersTableContent = ({
  hasNextPage,
  isPending,
  error,
  onLoadMore,
}: Pick<
  CharactersTableContentProps,
  "hasNextPage" | "isPending" | "error" | "onLoadMore"
>) => {
  const router = useRouter();

  const lastScrollY = useRef(0);
  const isScrollingDown = useRef(false);

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "600px",
    skip: !hasNextPage || isPending || !!error,
  });

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      isScrollingDown.current = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load more when in view AND scrolling down
  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isPending &&
      isScrollingDown.current &&
      !error
    ) {
      onLoadMore();
    }
  }, [inView, hasNextPage, isPending, onLoadMore, error]);

  const navigateToCharacter = useCallback(
    (characterId: string) => {
      router.push(`/${characterId}`);
    },
    [router]
  );

  return {
    metadata: {
      isPending,
      error,
      hasNextPage,
      inViewRef,
    },
    handler: {
      navigateToCharacter,
    },
  };
};
