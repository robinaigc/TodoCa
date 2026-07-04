import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "我要移民啦 · 加拿大登陆清单",
    template: "%s · 我要移民啦",
  },
  description:
    "加拿大登陆前后 6 个月中文任务清单。留学生、工签、新 PR 登陆温哥华，每一步该做什么，都帮你列好。",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "我要移民啦",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {children}
      </body>
    </html>
  );
}
