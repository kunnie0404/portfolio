import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "许晓琨 - UI 设计师作品集",
  description: "许晓琨的个人作品集，聚焦 App、Web、PC、智能穿戴与 AI 产品 UI 设计。",
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
      <body>{children}</body>
    </html>
  );
}
