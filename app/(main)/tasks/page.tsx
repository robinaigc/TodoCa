"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { StageId } from "@/types";
import { STAGES } from "@/data/stages";
import { useAppState } from "@/lib/store";
import { applicableTasks, sortTasks, taskStatus } from "@/lib/taskEngine";
import { computeStage } from "@/lib/stage";
import TaskCard from "@/components/TaskCard";
import PageHeader from "@/components/PageHeader";

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

  const groupedTasks = useMemo(() => {
    if (!profile) return [];

    let list = applicableTasks(profile);
    if (stageFilter) list = list.filter((t) => t.stageId === stageFilter);
    list = list.filter((t) => {
      const st = taskStatus(progress, t.id);
      switch (filter) {
        case "must":
          return t.priority === "P0";
        case "recommended":
          return t.priority === "P1";
        case "high_risk":
          return !!t.highRisk;
        case "serviceable":
          return !!t.serviceable;
        case "done":
          return st === "completed";
        case "todo":
          return st === "not_started";
        default:
          return true;
      }
    });

    return STAGES.filter((s) => !stageFilter || s.id === stageFilter)
      .map((stage) => ({
        stage,
        tasks: sortTasks(
          list.filter((t) => t.stageId === stage.id),
          currentStage
        ),
      }))
      .filter((g) => g.tasks.length > 0);
  }, [profile, progress, stageFilter, filter, currentStage]);

  const totalCount = groupedTasks.reduce((n, g) => n + g.tasks.length, 0);

  if (!ready) return <p className="py-20 text-center text-text-muted">加载中…</p>;

  if (!profile) {
    return (
      <main className="py-20 text-center">
        <p className="text-text-secondary">先完成几个小问题，生成你的专属任务清单。</p>
        <Link href="/onboarding" className="btn-primary mt-4 px-6 py-3 text-[15px]">
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

      <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 px-4 py-2 text-[13px] transition ${
              filter === f.id ? "pill-active" : "pill-inactive"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {totalCount === 0 ? (
        <p className="py-16 text-center text-sm text-text-muted">没有符合条件的任务</p>
      ) : (
        <div className="space-y-6">
          {groupedTasks.map(({ stage, tasks }) => (
            <section key={stage.id}>
              <SectionTitle
                title={stage.nameZh}
                count={tasks.length}
                isCurrent={stage.id === currentStage}
              />
              <div className="space-y-3">
                {tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    status={taskStatus(progress, t.id)}
                    onComplete={(id) =>
                      setTaskStatus(
                        id,
                        taskStatus(progress, id) === "completed" ? "not_started" : "completed"
                      )
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

function SectionTitle({
  title,
  count,
  isCurrent,
}: {
  title: string;
  count: number;
  isCurrent: boolean;
}) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-text-primary">
      <CalendarDays className="h-[18px] w-[18px] text-brand" strokeWidth={2} />
      {title}
      {isCurrent && <span className="text-[13px] font-semibold text-brand">（当前）</span>}
      <span className="text-[13px] font-medium text-text-muted">（{count}）</span>
    </h2>
  );
}

function StagePill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-2 text-[13px] transition ${
        active ? "pill-active" : "pill-inactive"
      }`}
    >
      {label}
    </button>
  );
}
