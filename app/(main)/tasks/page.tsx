"use client";

import { useMemo, useState } from "react";
import type { StageId } from "@/types";
import { STAGES } from "@/data/stages";
import { useAppState } from "@/lib/store";
import { applicableTasks, sortTasks, taskStatus } from "@/lib/taskEngine";
import { computeStage } from "@/lib/stage";
import TaskCard from "@/components/TaskCard";
import PageHeader from "@/components/PageHeader";
import Link from "next/link";

type Filter = "all" | "must" | "recommended" | "high_risk" | "serviceable" | "done" | "todo";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "todo", label: "未完成" },
  { id: "must", label: "必须做" },
  { id: "recommended", label: "建议做" },
  { id: "high_risk", label: "高风险" },
  { id: "serviceable", label: "可协助" },
  { id: "done", label: "已完成" },
];

export default function TasksPage() {
  const { ready, profile, progress, setTaskStatus } = useAppState();
  const [stageFilter, setStageFilter] = useState<StageId | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const currentStage = useMemo(
    () => (profile ? computeStage(profile.landingDate).stageId : "pre_landing"),
    [profile]
  );

  const tasks = useMemo(() => {
    if (!profile) return [];
    let list = applicableTasks(profile);
    if (stageFilter) list = list.filter((t) => t.stageId === stageFilter);
    list = list.filter((t) => {
      const st = taskStatus(progress, t.id);
      switch (filter) {
        case "must": return t.priority === "P0";
        case "recommended": return t.priority === "P1";
        case "high_risk": return !!t.highRisk;
        case "serviceable": return !!t.serviceable;
        case "done": return st === "completed";
        case "todo": return st === "not_started";
        default: return true;
      }
    });
    return sortTasks(list, currentStage);
  }, [profile, progress, stageFilter, filter, currentStage]);

  if (!ready) return <p className="py-20 text-center text-neutral-400">加载中…</p>;

  if (!profile) {
    return (
      <main className="py-20 text-center">
        <p className="text-neutral-500">先完成几个小问题，生成你的专属任务清单。</p>
        <Link href="/onboarding" className="mt-4 inline-block rounded-xl bg-red-600 px-6 py-3 font-semibold text-white">
          开始
        </Link>
      </main>
    );
  }

  return (
    <main>
      <PageHeader title="全部任务" subtitle="按阶段查看你的登陆任务清单" />

      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
        <StagePill active={stageFilter === null} onClick={() => setStageFilter(null)} label="全部阶段" />
        {STAGES.map((s) => (
          <StagePill
            key={s.id}
            active={stageFilter === s.id}
            onClick={() => setStageFilter(s.id)}
            label={s.nameZh + (s.id === currentStage ? "（当前）" : "")}
          />
        ))}
      </div>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] ${
              filter === f.id
                ? "bg-neutral-900 font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-400">没有符合条件的任务</p>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              status={taskStatus(progress, t.id)}
              showStage={stageFilter === null}
              onComplete={(id) =>
                setTaskStatus(id, taskStatus(progress, id) === "completed" ? "not_started" : "completed")
              }
            />
          ))}
        </div>
      )}
    </main>
  );
}

function StagePill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] ${
        active
          ? "border-red-500 bg-red-50 font-semibold text-red-700 dark:bg-red-950 dark:text-red-300"
          : "border-neutral-200 bg-white text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
      }`}
    >
      {label}
    </button>
  );
}
