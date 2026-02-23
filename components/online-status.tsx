interface OnlineStatusProps {
  isOnline?: boolean;
  size?: "sm" | "md";
}

export function OnlineStatus({ isOnline, size = "sm" }: OnlineStatusProps) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
  };

  if (!isOnline) return null;

  return (
    <div className="relative">
      <div
        className={`${sizeClasses[size]} rounded-full bg-green-500 ring-2 ring-background`}
      />
    </div>
  );
}
