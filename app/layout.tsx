import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollButtons from "@/components/ScrollButtons"; // Import the component

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  title: "Java Knowledge Hub - OCA & OCP Learning Platform",
  description: "Comprehensive Java OCA and OCP study guide with 500+ topics, interactive flashcards, and quizzes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950 min-h-screen`}>
        <div className="relative">
          <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="relative">
            <Header />
            <main className="container mx-auto px-4 py-8 min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <ScrollButtons /> {/* Add the component here */}
      </body>
    </html>
  );
}