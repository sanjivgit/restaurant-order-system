import React from "react";
import EmptyState from "./EmptyState";
import Skeleton from "./Skeleton";

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  rowClassName?: (row: T) => string;
}

function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyTitle = "Nothing here yet",
  emptyDescription = "New records will show up here once added.",
  rowClassName,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table className="table">
        <thead>
          <tr className="bg-base-200">
            {columns.map((col) => (
              <th key={col.header} className="text-xs uppercase tracking-wide text-base-content/60 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>
                    <Skeleton className="h-4 w-full max-w-[160px]" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading &&
            data.map((row) => (
              <tr key={keyExtractor(row)} className={rowClassName?.(row)}>
                {columns.map((col) => (
                  <td key={col.header} className={col.className}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {!isLoading && data.length === 0 && (
        <div className="py-10">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </div>
  );
}

export default Table;
