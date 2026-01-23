import type { HTMLAttributes } from "react";

export function Table({ className = "", children, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-slate-100 ${className}`} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className = "", children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={`bg-slate-50 ${className}`} {...rest}>
      {children}
    </thead>
  );
}

export function TBody({ className = "", children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-slate-100 ${className}`} {...rest}>
      {children}
    </tbody>
  );
}

export function TH({ className = "", children, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={`px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TD({ className = "", children, ...rest }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={`px-4 py-2 text-sm text-slate-700 ${className}`} {...rest}>
      {children}
    </td>
  );
}

