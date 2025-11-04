import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/src/components/sidebar";

export const metadata: Metadata = {
  title: "Debt Management | Track & Manage Your Debts",
  description: "Comprehensive debt management application to track loans, payments, and achieve financial freedom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
