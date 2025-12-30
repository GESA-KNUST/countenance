import { Poppins, Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { Metadata, Viewport } from "next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const open_sans = Open_Sans({
  variable: "--font-open_sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gesaknust.com'),
  title: {
    default: "GESA-KNUST | Ghana Engineering Students Association",
    template: "%s | GESA-KNUST"
  },
  description: "Official website of the Ghana Engineering Students Association (GESA) at Kwame Nkrumah University of Science and Technology (KNUST), Kumasi. Empowering future engineers in the College of Engineering.",
  keywords: [
    "GESA", "GESA-KNUST", "Ghana Engineering Students Association", "KNUST", "Kumasi",
    "College of Engineering", "Engineering Students", "Technology", "Innovation", "Student Association",
    "STEM", "Engineering Society", "Tech Community", "Student Leadership", "Academic Excellence",
    "Engineering Projects", "Career Development", "Mentorship", "Hackathons", "Industrial Training",
    "Engineering Workshops", "Future Engineers", "Ghana Tech", "University Students"
  ],
  authors: [{ name: "GESA-KNUST" }],
  creator: "GESA-KNUST",
  publisher: "GESA-KNUST",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://www.gesaknust.com",
    siteName: "GESA-KNUST",
    title: "GESA-KNUST | Ghana Engineering Students Association",
    description: "Building Civilization. The official website of the Ghana Engineering Students Association (GESA) at KNUST. Empowering students with innovation, technology, and leadership.",
    images: [
      {
        url: "https://www.gesaknust.com/images/logo.png?v=1",
        width: 1200,
        height: 630,
        alt: "GESA-KNUST Logo",
        secureUrl: "https://www.gesaknust.com/images/logo.png?v=1",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GESA-KNUST",
    description: "Official website of the Ghana Engineering Students Association (GESA) at KNUST.",
    creator: "@thegesaknust",
    images: ["https://www.gesaknust.com/images/logo.png?v=1"],
  },
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GESA-KNUST",
  },
  icons: {
    apple: "/images/logo.png",
  },
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ghana Engineering Students Association - KNUST",
    "alternateName": "GESA-KNUST",
    "url": "https://www.gesaknust.com",
    "logo": "https://www.gesaknust.com/images/logo.png?v=1",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+233 20 057 6468",
      "contactType": "customer service",
      "email": "thegesaknust@gmail.com",
      "areaServed": "GH",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://x.com/thegesaknust",
      "https://www.instagram.com/thegesaknust",
      "https://www.linkedin.com/company/gesa-knust/",
      "https://whatsapp.com/channel/0029Vb6ndaFDeON4BBZULN0A"
    ]
  };

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${open_sans.variable} ${montserrat.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div>
          <ServiceWorkerRegister />
          <Navbar />
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
          <Footer />
        </div>
      </body>
    </html>
  );
}
