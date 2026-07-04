"use client";

import Link from "next/link";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { RESOURCE_MAP, RESOURCE_CATEGORIES } from "@/data/resources";

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const resource = RESOURCE_MAP[id];
  const [copied, setCopied] = useState(false);

  if (!resource) notFound();

  const catName = RESOURCE_CATEGORIES.find((c) => c.id === resource.category)?.nameZh;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${resource.name} ${resource.address}`
  )}`;

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(resource.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 忽略剪贴板错误
    }
  }

  return (
    <main className="pb-8">
      <Link href="/map" className="mb-3 inline-block text-sm text-neutral-500">
        ← 返回地图
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {catName}
        </span>
        {resource.isOfficial && (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700 dark:bg-green-950 dark:text-green-300">
            官方 / 公共机构
          </span>
        )}
      </div>
      <h1 className="mt-1.5 text-2xl font-bold leading-snug">{resource.name}</h1>
      <p className="mt-2 text-[15px] text-neutral-600 dark:text-neutral-300">{resource.descriptionZh}</p>

      {resource.notesZh && (
        <div className="mt-4 rounded-xl bg-amber-50 p-3.5 text-sm leading-relaxed text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          💡 {resource.notesZh}
        </div>
      )}

      <div className="mt-6 space-y-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-neutral-400">地址</p>
            <p className="mt-0.5 text-sm">{resource.address}</p>
          </div>
          <button onClick={copyAddress} className="shrink-0 text-sm font-medium text-blue-600 dark:text-blue-400">
            {copied ? "✓ 已复制" : "复制"}
          </button>
        </div>
        {resource.phone && (
          <div>
            <p className="text-xs text-neutral-400">电话</p>
            <a href={`tel:${resource.phone}`} className="mt-0.5 block text-sm font-medium text-blue-600 dark:text-blue-400">
              {resource.phone}
            </a>
          </div>
        )}
        {resource.website && (
          <div>
            <p className="text-xs text-neutral-400">官网</p>
            <a href={resource.website} target="_blank" rel="noopener noreferrer"
              className="mt-0.5 block break-all text-sm font-medium text-blue-600 underline dark:text-blue-400">
              {resource.website}
            </a>
          </div>
        )}
      </div>

      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 block rounded-xl bg-red-600 py-3.5 text-center text-[15px] font-semibold text-white active:bg-red-700"
      >
        🗺 在 Google Maps 中打开
      </a>

      <p className="mt-4 text-center text-[11px] text-neutral-400">
        地址和电话可能变动，出发前建议先打电话或查官网确认。
      </p>
    </main>
  );
}
