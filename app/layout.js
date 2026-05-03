import { Inter } from "next/font/google";
import "./globals.css";

import Header from "@/components/HeaderClient";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider"; // from shadcn-ui or custom

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "Finfold",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark.png" />

          <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" /> 
          {/* for android */}
        </head>

        <body
          className={`font-sans ${inter.variable} bg-background text-foreground antialiased`}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="min-h-screen container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Toaster richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
