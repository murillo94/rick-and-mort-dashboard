"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import { Table } from "@/ui/table";
import { Avatar } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { InlineError } from "../error";

import type { Character } from "@/data-access/schemas";

type CharactersTableProps = {
  data: Character[];
  totalCount: number;
  hasNextPage: boolean;
  onLoadMore: () => void;
  isPending: boolean;
  error?: string | null;
  onRetry?: () => void;
};

const columns: ColumnDef<Character>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-2 capitalize">
        <Avatar src={row.original.image} alt={row.original.name} />
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("species")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">{row.getValue("status")}</span>
    ),
  },
];

export function CharactersTable({
  data,
  totalCount,
  hasNextPage,
  onLoadMore,
  isPending,
  error,
  onRetry,
}: CharactersTableProps) {
  const router = useRouter();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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

  return (
    <div>
      <Table>
        <Table.Caption>
          {totalCount
            ? `A list of ${totalCount} characters. Scroll to see more.`
            : "No characters found."}
        </Table.Caption>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Table.Head>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row
              key={row.id}
              onClick={() => router.push(`/${row.original.id}`)}
              className="cursor-pointer"
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
          {hasNextPage && (
            <Table.Row ref={inViewRef}>
              <Table.Cell colSpan={columns.length} className="text-center py-8">
                {isPending && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full" />
                    <span className="text-sm text-primary-600">
                      Loading more characters...
                    </span>
                  </div>
                )}
                {error && onRetry && (
                  <div className="flex flex-col items-center gap-3">
                    <InlineError message={error} />
                    <Button onClick={onRetry} variant="primary" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}
