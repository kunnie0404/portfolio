import type { Metadata } from "next";
import { SpotlightCursor } from "@/components/ui/spotlight-cursor";
import "./globals.css";

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
    <html lang="zh-CN">
      <body>
        {children}
        <SpotlightCursor />
      </body>
    </html>
  );
}
