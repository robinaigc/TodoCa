"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ResourceCategory } from "@/types";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/data/resources";
import PageHeader from "@/components/PageHeader";

export default function MapPage() {
  const [category, setCategory] = useState<ResourceCategory | null>(null);

  const list = useMemo(
    () => (category ? RESOURCES.filter((r) => r.category === category) : RESOURCES),
    [category]
  );

  const catName = (id: ResourceCategory) =>
    RESOURCE_CATEGORIES.find((c) => c.id === id)?.nameZh ?? id;

  return (
    <main>
      <PageHeader title="新人地图" subtitle="温哥华办事和生活资源，一键打开导航。" />

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Pill active={category === null} onClick={() => setCategory(null)} label="全部" />
        {RESOURCE_CATEGORIES.map((c) => (
          <Pill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} label={c.nameZh} />
        ))}
      </div>

      <div className="space-y-2.5">
        {list.map((r) => (
          <Link
            key={r.id}
            href={`/resources/${r.id}`}
            className="block rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium leading-snug">{r.name}</p>
              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {catName(r.category)}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">{r.descriptionZh}</p>
            <p className="mt-1 text-[12px] text-neutral-400">📍 {r.address}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

function Pill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] ${
        active
          ? "bg-neutral-900 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
