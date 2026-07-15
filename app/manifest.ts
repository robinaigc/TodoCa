import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "TodoCa / 我要移民啦",
    short_name: "TodoCa",
    description: "加拿大登陆前后 6 个月中文任务管理、信息整理与生活资源导航工具",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#9e3434",
    lang: "zh-CN",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
