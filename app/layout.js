import { DynaPuff } from "next/font/google";

import "./globals.css";
import { SocketProvider } from "@/contexts/SocketContext";
import { Toaster } from "sonner";
import Silk from "@/components/ui/Silk/Silk";

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
          <div className="relative">
            {/* Silk background */}
            <div className="fixed inset-0 z-0">
              <Silk
                speed={5}
                scale={1}
                color="#0000FF"
                noiseIntensity={1.5}
                rotation={0}
              />
            </div>
            {/* Content layer */}
            <main className="relative z-10 text-white">{children}</main>
          </div>
          <Toaster richColors position="top-center" />
        </SocketProvider>
      </body>
    </html>
  );
}
