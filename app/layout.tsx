import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { SpotlightCursor } from "@/components/ui/spotlight-cursor";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "许晓琨｜UI 设计作品集",
  description: "许晓琨的个人 UI 设计作品集，聚焦 App、Web、智能穿戴与动态视觉设计。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={figtree.variable}>
      <body>
        {children}
        <SpotlightCursor />
      </body>
    </html>
  );
}
