// src/components/Organisms/MasterTable.tsx
import type { ReactNode } from "react";

// Định nghĩa cấu trúc của một cột
export interface TableColumn<T> {
  header: string;                     // Tiêu đề cột (VD: "Tên phòng")
  accessorKey?: keyof T;              // Key để lấy dữ liệu thô (nếu có)
  cell?: (item: T) => ReactNode;
  align?: "left" | "center" | "right"; 
}

interface MasterTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  emptyMessage?: string;
}

export default function MasterTable<T>({ 
  data, 
  columns, 
  emptyMessage = "No data available." 
}: MasterTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-3xl bg-card-bg backdrop-blur-xl border border-card-border shadow-sm liquid-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase font-bold text-card-text border-b border-card-border bg-black/5 dark:bg-white/5">
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index} 
                className={`px-6 py-5 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'} 
                            ${index === 0 ? 'rounded-tl-3xl' : ''} 
                            ${index === columns.length - 1 ? 'rounded-tr-3xl' : ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-card-text font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-card-border/50 hover:bg-btn-glass-bg transition-colors duration-200 group">
                {columns.map((col, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`px-6 py-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {/* Nếu có hàm cell custom thì render cell, nếu không thì in ra giá trị thô từ accessorKey */}
                    {col.cell ? col.cell(row) : (col.accessorKey ? String(row[col.accessorKey] || "—") : "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}