import Image from "next/image";

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
      role="banner"
    >
      {/* priority tells Next.js to preload this image — it's the LCP element */}
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />

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
