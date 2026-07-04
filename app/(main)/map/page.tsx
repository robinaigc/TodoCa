"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import type { ResourceCategory } from "@/types";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/data/resources";
import { SERVICE_CATEGORIES } from "@/data/services";
import PageHeader from "@/components/PageHeader";

type NavTab = "places" | "services";

export default function MapPage() {
  const [tab, setTab] = useState<NavTab>("places");
  const [category, setCategory] = useState<ResourceCategory | null>(null);

  const list = useMemo(
    () => (category ? RESOURCES.filter((r) => r.category === category) : RESOURCES),
    [category]
  );

  const catName = (id: ResourceCategory) =>
    RESOURCE_CATEGORIES.find((c) => c.id === id)?.nameZh ?? id;

  return (
    <main>
      <PageHeader
        title="生活导航"
        subtitle="办事地点一键导航；华人本地服务即将开放，首批从教育补习切入。"
      />

      <div className="pill-track mb-5">
        <button
          type="button"
          onClick={() => setTab("places")}
          className={`flex-1 px-4 py-2.5 text-[14px] transition ${
            tab === "places" ? "pill-active" : "pill-inactive"
          }`}
        >
          办事地点
        </button>
        <button
          type="button"
          onClick={() => setTab("services")}
          className={`flex-1 px-4 py-2.5 text-[14px] transition ${
            tab === "services" ? "pill-active" : "pill-inactive"
          }`}
        >
          华人服务
        </button>
      </div>

      {tab === "places" ? (
        <>
          <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
            <Pill active={category === null} onClick={() => setCategory(null)} label="全部" />
            {RESOURCE_CATEGORIES.map((c) => (
              <Pill
                key={c.id}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
                label={c.nameZh}
              />
            ))}
          </div>

          <div className="space-y-3">
            {list.map((r) => (
              <Link key={r.id} href={`/resources/${r.id}`} className="list-row">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold leading-snug text-text-primary">{r.name}</p>
                  <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                    {catName(r.category)}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-text-secondary">{r.descriptionZh}</p>
                <p className="mt-1.5 flex items-center gap-1 text-[12px] text-text-muted">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                  {r.address}
                </p>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="card-soft-sm mb-4 bg-brand-soft/30 p-4">
            <p className="text-[15px] font-semibold text-text-primary">华人本地服务 · 即将开放</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              我们正在招募温哥华华人小企业与个体服务者。首批将从
              <span className="font-semibold text-brand"> 教育补习 </span>
              切入，之后逐步开放家政、维修、剪草等分类。
            </p>
          </div>

          <div className="space-y-3">
            {SERVICE_CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.id} className="card-soft-sm p-4 opacity-90">
                  <div className="flex items-start gap-3">
                    <div className="icon-circle">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-text-primary">{c.nameZh}</p>
                        {c.launchPriority ? (
                          <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                            首批开放
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary">
                            即将开放
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                        {c.descZh}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-center text-[12px] leading-relaxed text-text-muted">
            如果你是服务提供者，欢迎通过「我的 → 联系人工协助」留下信息，我们会优先联系教育补习类商户。
          </p>
        </>
      )}
    </main>
  );
}

function Pill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 text-[13px] transition ${active ? "pill-active" : "pill-inactive"}`}
    >
      {label}
    </button>
  );
}
