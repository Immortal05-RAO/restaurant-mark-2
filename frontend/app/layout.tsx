import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Adjust import path assuming 'context' is now peer to 'app'
import { CartProvider } from "../context/CartContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Premium QR Dining",
  description: "Seamless table ordering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}

