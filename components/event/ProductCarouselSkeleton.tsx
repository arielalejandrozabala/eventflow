export default function ProductCarouselSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-64 bg-white rounded-2xl border border-gray-100 animate-pulse"
        >
          <div className="h-40 bg-gray-200 rounded-t-2xl" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-9 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
