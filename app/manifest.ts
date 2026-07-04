import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "我要移民啦 · 加拿大登陆清单",
    short_name: "我要移民啦",
    description: "加拿大登陆前后 6 个月中文任务清单",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#9e3434",
    lang: "zh-CN",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
