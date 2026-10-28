export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4" aria-hidden>
      <div className="flex items-center gap-3">
        <div className="skeleton size-12 rounded-xl bg-page" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="skeleton h-4 w-2/3 bg-page" />
          <div className="skeleton h-3 w-1/3 bg-page" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <div className="skeleton h-3 w-16 bg-page" />
          <div className="skeleton h-6 w-24 bg-page" />
        </div>
        <div className="skeleton h-6 w-14 rounded-full bg-page" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function LoadingLabel() {
  return (
    <p className="flex items-center gap-2 text-sm text-ink/60" role="status">
      <span className="loading loading-spinner loading-xs text-brand" /> Loading… দাম লোড হচ্ছে
    </p>
  );
}
