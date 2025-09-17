import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/lib/theme";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GlobalFooter } from "@/components/ui/GlobalFooter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "e& GTM Director Portal",
  description: "Go-to-Market Director Demo Portal for e& Business Operations",
  keywords: ["e&", "etisalat", "gtm", "business", "portal", "uae"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <div className="min-h-screen bg-white flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <GlobalFooter />
            </div>
          </AuthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}