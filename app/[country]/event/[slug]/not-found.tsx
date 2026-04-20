import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20 space-y-6">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800">Event Not Found</h2>
        <p className="text-gray-500">
          The event you're looking for doesn't exist or has been removed.
        </p>
      </div>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
