import type { Metadata } from "next";
import "@/styles/globals.css";
import { SensoryProvider } from "@/contexts/SensoryContext";
import dynamic from "next/dynamic";
const GlobalCanvas = dynamic(() => import("@/components/GlobalCanvas"), { ssr: false });
import Cursor from "@/components/Cursor/Cursor";

export const metadata: Metadata = {
  title: "Obsidian Noir — Creative Portfolio",
  description: "A premium minimalist portfolio with global motion graphics and immersive digital experiences.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="loading">
        <SensoryProvider>
          <div className="grain" aria-hidden="true" />
          <GlobalCanvas />
          <Cursor />
          {children}
        </SensoryProvider>
      </body>
    </html>
  );
}
