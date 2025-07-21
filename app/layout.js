import { DynaPuff } from "next/font/google";

import "./globals.css";
import { SocketProvider } from "@/contexts/SocketContext";
import { Toaster } from "sonner";

const dynaPuff = DynaPuff({ subsets: ["latin"] });

export const metadata = {
  title: "WitLink",
  description: "Real-time quiz platform. Play, learn, and compete with others.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dynaPuff.className} antialiased`}>
        <SocketProvider>
          <main className="bg-gradient-to-bl from-amber-50 to-blue-50 tex-black">
            {children}
          </main>
          <Toaster richColors position="top-center" />
        </SocketProvider>
      </body>
    </html>
  );
}
