// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';

export interface TableProps {
  /** Table content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable table container component
 * @param props {@link TableProps}
 * @returns {ReactNode}
 */
export function Table({ children, className }: TableProps): ReactNode {
  return (
    <table
      className={['w-full border-collapse text-sm', className ?? ''].join(' ')}
    >
      {children}
    </table>
  );
}

/**
 * Reusable table body component
 * @param props {@link TableProps}
 * @returns {ReactNode}
 */
export function TableBody({ children, className }: TableProps): ReactNode {
  return <tbody className={className}>{children}</tbody>;
}

/**
 * Reusable table row component
 * @param props {@link TableProps}
 * @returns {ReactNode}
 */
export function TableRow({ children, className }: TableProps): ReactNode {
  return (
    <tr
      className={[
        'border-b border-border hover:bg-muted/50 transition-colors',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </tr>
  );
}

/**
 * Reusable table cell component
 * @param props {@link TableProps}
 * @returns {ReactNode}
 */
export function TableCell({ children, className }: TableProps): ReactNode {
  return (
    <td
      className={[
        'py-1.5 px-2.5 align-middle whitespace-nowrap *:align-middle',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </td>
  );
}
