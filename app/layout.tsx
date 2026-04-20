import "./globals.css";

export const metadata = {
  title: "EventFlow",
  description: "Dynamic event platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to image CDN — establishes DNS+TCP+TLS early to reduce LCP latency */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
      </head>
      <body className="bg-gray-50 text-gray-900">
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}