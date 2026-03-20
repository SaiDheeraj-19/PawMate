import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: "PawMate | The Digital Estate for Curated Companionship",
  description: "A refined matchmaking environment for the modern companion. Whether for joyful playdates or elite breeding, PawMate ensures safety and elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${notoSerif.variable} font-sans antialiased min-h-screen bg-background`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
