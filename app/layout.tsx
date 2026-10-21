import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/lib/auth/auth-provider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"], weight: ["400", "500", "700", "800"], variable: "--font-jakarta",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "VigiXpress | Food, Grocery & Everyday Essentials in Ogun State",
    template: `%s | ${SITE.name}`,
  },
  description: "Discover food, groceries and everyday essentials with VigiXpress in Ogun State. Contact us to confirm delivery availability in your community.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: SITE.name,
    title: "VigiXpress | Food, Grocery & Everyday Essentials in Ogun State",
    description: "Discover food, groceries and everyday essentials with VigiXpress in Ogun State. Contact us to confirm delivery availability in your community.",
    images: [{ url: "/assets/og.png", width: 1200, height: 630, alt: "VigiXpress - Delivery in Ogun State" }],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VigiXpress | Food, Grocery & Everyday Essentials in Ogun State",
    description: "Discover food, groceries and everyday essentials with VigiXpress in Ogun State. Contact us to confirm delivery availability in your community.",
    images: ["/assets/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/assets/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/assets/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#org`,
      name: SITE.name,
      alternateName: "VigilXpress",
      url: SITE.url,
      logo: `${SITE.url}/assets/logo.png`,
      sameAs: [SITE.instagram, SITE.facebook, SITE.x].filter(Boolean),
    },
    {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      inLanguage: "en-NG",
      publisher: { "@id": `${SITE.url}/#org` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={jakarta.variable}>
      <body className="font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}