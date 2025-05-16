import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { SessionProvider } from "./components/SessionProvider";
import Navbar from "./components/Navbar";
import ToastProvider from "./components/ToastProvider";
import prisma from "./lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tasteful Picks - Movie Recommendations",
  description: "Discover your next favorite movie with personalized recommendations",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen`}
      >
        <SessionProvider session={session}>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <ToastProvider />
        </SessionProvider>
      </body>
    </html>
  );
}
