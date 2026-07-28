"use client";

import Link from "next/link";
import { ChevronLeft, Lightbulb, MapPinned } from "lucide-react";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { RESOURCE_MAP, RESOURCE_CATEGORIES } from "@/data/resources";

export default function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const resource = RESOURCE_MAP[id];
  const [copied, setCopied] = useState(false);

  if (!resource) notFound();

  const catName = RESOURCE_CATEGORIES.find((c) => c.id === resource.category)?.nameZh;
  const locationQuery = encodeURIComponent(`${resource.name} ${resource.address}`);
  const appleMapsUrl = `https://maps.apple.com/?q=${locationQuery}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;

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
      <Link
        href="/map"
        className="mb-4 inline-flex min-h-11 items-center gap-1 rounded-xl py-2 pr-3 pl-1 text-[15px] font-semibold text-text-secondary active:opacity-70"
      >
        <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} />
        返回导航
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
          {catName}
        </span>
        {resource.isOfficial && (
          <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-[11px] font-semibold text-success">
            官方 / 公共机构
          </span>
        )}
      </div>
      <h1 className="mt-1.5 text-2xl font-bold leading-snug text-text-primary">{resource.name}</h1>
      <p className="mt-2 text-[15px] text-text-secondary">{resource.descriptionZh}</p>

      {resource.notesZh && (
        <div className="card-soft-sm mt-4 flex items-start gap-2 bg-brand-soft/40 p-4 text-sm leading-relaxed text-text-primary">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <span>{resource.notesZh}</span>
        </div>
      )}

      <div className="card-soft mt-6 space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-text-muted">地址</p>
            <p className="mt-0.5 text-sm text-text-primary">{resource.address}</p>
          </div>
          <button onClick={copyAddress} className="link-brand min-h-11 shrink-0 rounded-xl px-2 text-sm">
            {copied ? "✓ 已复制" : "复制"}
          </button>
        </div>
        {resource.phone && (
          <div>
            <p className="text-xs text-text-muted">电话</p>
            <a href={`tel:${resource.phone}`} className="link-brand mt-0.5 block text-sm">
              {resource.phone}
            </a>
          </div>
        )}
        {resource.website && (
          <div>
            <p className="text-xs text-text-muted">官网</p>
            <a
              href={resource.website}
              target="_blank"
              rel="noopener noreferrer"
              className="link-brand mt-0.5 block break-all text-sm underline"
            >
              {resource.website}
            </a>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary flex py-3.5 text-center text-[15px]">
          <MapPinned className="mr-2 h-5 w-5" aria-hidden="true" />
          在 Apple Maps 中打开
        </a>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary flex py-3.5 text-center text-[15px]">
          <MapPinned className="mr-2 h-5 w-5" aria-hidden="true" />
          在 Google Maps 中打开
        </a>
      </div>

      <p className="mt-4 text-center text-[11px] text-text-muted">
        地址和电话可能变动，出发前建议先打电话或查官网确认。
      </p>
    </main>
  );
}
