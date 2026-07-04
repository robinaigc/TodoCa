"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ScriptCategory } from "@/types";
import { SCRIPTS, SCRIPT_CATEGORIES } from "@/data/scripts";
import PageHeader from "@/components/PageHeader";

export default function ScriptsPage() {
  const [category, setCategory] = useState<ScriptCategory | null>(null);

  const list = useMemo(
    () => (category ? SCRIPTS.filter((s) => s.category === category) : SCRIPTS),
    [category]
  );

  const catName = (id: ScriptCategory) =>
    SCRIPT_CATEGORIES.find((c) => c.id === id)?.nameZh ?? id;

  return (
    <main>
      <PageHeader title="英文脚本库" subtitle="办事不会说？照着念就行，还有邮件模板。" />

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <Pill active={category === null} onClick={() => setCategory(null)} label="全部" />
        {SCRIPT_CATEGORIES.map((c) => (
          <Pill key={c.id} active={category === c.id} onClick={() => setCategory(c.id)} label={c.nameZh} />
        ))}
      </div>

      <div className="space-y-2.5">
        {list.map((s) => (
          <Link
            key={s.id}
            href={`/scripts/${s.id}`}
            className="block rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{s.titleZh}</p>
              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {catName(s.category)}
              </span>
            </div>
            <p className="mt-1 line-clamp-1 text-[13px] italic text-neutral-400">“{s.simpleEn}”</p>
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
