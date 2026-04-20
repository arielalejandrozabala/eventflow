export default function HomeHero() {
  return (
    <div className="py-12 space-y-3">
      <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
        ⚡ Limited time events
      </p>
      <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
        Shop the biggest<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
          sales of the year
        </span>
      </h1>
      <p className="text-lg text-gray-500 max-w-lg">
        Exclusive deals across electronics, gaming, and more — available in your region for a limited time.
      </p>
    </div>
  );
}
