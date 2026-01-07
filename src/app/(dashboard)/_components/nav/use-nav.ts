import { usePathname } from "next/navigation";

export const useNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      // Match "/" and any "/[id]" routes (e.g., "/1", "/2", etc.)
      return pathname === "/" || /^\/\d+$/.test(pathname);
    }

    return pathname === href;
  };

  return {
    handler: {
      isActive,
    },
  };
};
