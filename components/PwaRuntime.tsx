"use client";

import { useEffect, useState } from "react";

export default function PwaRuntime() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const updateNetworkState = () => setOffline(!navigator.onLine);
    updateNetworkState();

    window.addEventListener("online", updateNetworkState);
    window.addEventListener("offline", updateNetworkState);

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // The app remains usable online even if service worker registration fails.
      });
    }

    return () => {
      window.removeEventListener("online", updateNetworkState);
      window.removeEventListener("offline", updateNetworkState);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-4 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 mx-auto max-w-sm rounded-2xl bg-[#1a1d26] px-4 py-3 text-center text-sm font-semibold text-white shadow-lg"
    >
      当前没有网络。已保存的任务进度仍保留在此设备。
    </div>
  );
}
