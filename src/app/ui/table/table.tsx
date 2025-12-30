import { cn } from "@/utils/cn";

const Table = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto rounded-lg border border-primary-600/15 bg-white">
    <table
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
);

const TableHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn(
      "border-b bg-primary-50 text-primary-600 [&_tr]:border-b border-b-primary-600/15",
      className
    )}
    {...props}
  />
);

const TableBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot
    className={cn(
      "border-t bg-primary-50 font-medium text-primary-800 [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
);

const TableRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      "border-b transition-colors hover:bg-primary-50 data-[state=selected]:bg-primary-100 border-b-primary-600/15",
      className
    )}
    {...props}
  />
);

const TableHead = ({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide text-primary-600 border-b border-b-primary-600/15",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
);

const TableCell = ({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      "p-4 align-middle text-primary-800 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
);

const TableCaption = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={cn("mt-4 px-2 text-sm text-primary-600", className)}
    {...props}
  />
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Footer = TableFooter;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Caption = TableCaption;

export { Table };
