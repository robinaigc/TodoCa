import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["500", "600", "700"],
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto",
  weight: ["400", "500", "600", "700"],
});

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
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#9e3434",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${nunitoSans.variable} ${notoSansSC.variable} h-full antialiased`}
    >
      <body className="surface-page min-h-full">
        {children}
      </body>
    </html>
  );
}
