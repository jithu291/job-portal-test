export default function EmptyState({ message }: { message: string }) {
  return (
    <div className="card w-full py-16 px-6 text-center">
      <p className="text-slate-500">{message}</p>
    </div>
  );
}
