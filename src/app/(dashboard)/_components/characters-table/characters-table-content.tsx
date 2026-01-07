"use client";

import { RefreshCw } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  type CharactersTableContentProps,
  useCharactersTableContent,
} from "./use-characters-table-content";

import { Table } from "@/ui/table";
import { Avatar } from "@/ui/avatar";
import { Button } from "@/ui/button";
import { InlineError } from "../error";

import type { Character } from "@/data-access/schemas";

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

export const CharactersTableContent = ({
  data,
  totalCount,
  hasNextPage,
  isPending,
  error,
  onLoadMore,
  onRetry,
}: CharactersTableContentProps) => {
  const { metadata, handler } = useCharactersTableContent({
    hasNextPage,
    isPending,
    error,
    onLoadMore,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
              onClick={() => handler.navigateToCharacter(row.original.id!)}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
          {metadata.hasNextPage && (
            <Table.Row ref={metadata.inViewRef}>
              <Table.Cell colSpan={columns.length} className="text-center py-8">
                {metadata.isPending && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full" />
                    <span className="text-sm text-primary-600">
                      Loading more characters...
                    </span>
                  </div>
                )}
                {metadata.error && onRetry && (
                  <div className="flex flex-col items-center gap-3">
                    <InlineError message={metadata.error} />
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
};
