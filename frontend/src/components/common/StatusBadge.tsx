const colors: Record<string, string> = {
  DRAFT: 'bg-amber-100 text-amber-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-slate-100 text-slate-600',
  PENDING: 'bg-amber-100 text-amber-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  REJECTED: 'bg-red-100 text-red-700',
  ACCEPTED: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${colors[status] || ''}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
