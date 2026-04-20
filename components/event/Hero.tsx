type Props = {
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
};

export default function Hero({ title, subtitle, badge, imageUrl }: Props) {
  return (
    <div
      className="relative w-full h-80 rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
      role="banner"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 space-y-3">
        {badge && (
          <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight drop-shadow-lg">
          {title}
        </h1>
        <p className="text-lg text-white/80 max-w-md mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
