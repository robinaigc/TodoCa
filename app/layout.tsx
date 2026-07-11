import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "TodoCa / 我要移民啦",
  title: {
    default: "TodoCa · 我要移民啦 · 加拿大登陆清单",
    template: "%s · TodoCa",
  },
  description:
    "面向留学生、工签人士和新永久居民的加拿大登陆前后 6 个月中文任务管理、信息整理与生活资源导航工具。",
  manifest: "/manifest.webmanifest",
  category: "productivity",
  appleWebApp: {
    capable: true,
    title: "TodoCa",
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#9e3434",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="surface-page min-h-full">
        {children}
      </body>
    </html>
  );
}
