"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-20 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Something went wrong</h2>
      <p className="text-gray-500 text-sm">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 transition"
      >
        Try again
      </button>
    </div>
  );
}
