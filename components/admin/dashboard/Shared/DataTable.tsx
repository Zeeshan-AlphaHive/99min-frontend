import React from 'react';
import DataTablePagination from './DataTablePagination';

export type ColumnDef<T> = {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  rows: T[];
  getRowKey: (row: T) => string | number;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  toolbar?: React.ReactNode;
};

export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  totalResults,
  currentPage = 1,
  totalPages = 3,
  onPageChange,
  toolbar,
}: DataTableProps<T>) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
  {toolbar && (
    <div className="px-4 sm:px-6 pt-4 pb-2 border-b border-gray-100">
      {toolbar}
    </div>
  )}

  <div className="overflow-x-hidden">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-100">
          {columns.map((col) => (
            <th
              key={col.key}
              className="py-3 sm:py-3.5 px-3 sm:px-6 text-xs font-medium text-textGray"
              style={col.width ? { width: col.width } : undefined}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((row) => (
          <tr key={getRowKey(row)} className="hover:bg-gray-50 transition-colors">
            {columns.map((col) => (
              <td key={col.key} className="py-3 sm:py-4 px-3 sm:px-6">
                {col.render(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>

 

      <DataTablePagination
        totalResults={totalResults ?? rows.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}