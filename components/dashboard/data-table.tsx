'use client';

import React from 'react';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'brand'
  | 'neutral';

export function StatusBadge({
  status,
  variant,
}: {
  status: string;
  variant?: StatusVariant;
}) {
  // Auto-detect variant if not passed
  let resolvedVariant: StatusVariant = variant || 'neutral';
  if (!variant) {
    const s = status.toLowerCase();
    if (s.includes('paid') || s.includes('delivered') || s.includes('active') || s.includes('ready') || s.includes('completed')) {
      resolvedVariant = 'success';
    } else if (s.includes('pending') || s.includes('preparing') || s.includes('progress') || s.includes('offered')) {
      resolvedVariant = 'warning';
    } else if (s.includes('cancel') || s.includes('reject') || s.includes('failed') || s.includes('suspended')) {
      resolvedVariant = 'danger';
    } else if (s.includes('merchant') || s.includes('assigned') || s.includes('transit')) {
      resolvedVariant = 'brand';
    }
  }

  const styles: Record<StatusVariant, string> = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-sky-100 text-sky-700 border-sky-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${
        styles[resolvedVariant]
      }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  emptyMessage?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  columns,
  data,
  keyExtractor = (_, index) => String(index),
  emptyMessage = 'No records found.',
  actions,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`card overflow-hidden !p-0 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-line">
          <div>
            {title && <h2 className="text-base font-bold text-ink">{title}</h2>}
            {subtitle && (
              <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50/80 border-b border-line text-xs font-bold uppercase tracking-wider text-neutral-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-5 py-3.5 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-8 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={keyExtractor(row, index)}
                  className="hover:bg-neutral-50/60 transition-colors"
                >
                  {columns.map((col) => {
                    const value = row[col.key];
                    return (
                      <td
                        key={col.key}
                        className={`px-5 py-4 text-ink ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        } ${col.className || ''}`}
                      >
                        {col.render
                          ? col.render(row, index)
                          : (value as React.ReactNode)}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
