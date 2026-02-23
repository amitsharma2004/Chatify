export function MessageListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${
            i % 2 === 0 ? "flex-row" : "flex-row-reverse"
          }`}
        >
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col gap-2">
            <div
              className={`h-16 w-48 animate-pulse rounded-lg bg-muted ${
                i % 2 === 0 ? "" : "ml-auto"
              }`}
            />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
