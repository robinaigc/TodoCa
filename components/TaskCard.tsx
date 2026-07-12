"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import { HighRiskBadge, PriorityBadge, StageBadge } from "@/components/Badges";

interface Props {
  task: Task;
  status: TaskStatus;
  onComplete?: (taskId: string) => void;
  showStage?: boolean;
}

export default function TaskCard({ task, status, onComplete, showStage }: Props) {
  const completed = status === "completed";
  const skipped = status === "skipped";

  return (
    <div
      className={`card-soft-sm p-4 ${
        completed ? "bg-success-soft/40" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          aria-label={completed ? "已完成" : "标记完成"}
          onClick={() => onComplete?.(task.id)}
          className="-m-2 mt-[-0.375rem] flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        >
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm transition ${
              completed
                ? "bg-[var(--color-success)] text-white shadow-sm"
                : "bg-white text-transparent shadow-[var(--shadow-card-sm)] ring-2 ring-[#e4e8ef] hover:ring-brand/40"
            }`}
          >
            ✓
          </span>
        </button>

        <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
          <p
            className={`text-[15px] font-semibold leading-snug ${
              completed || skipped
                ? "text-text-muted line-through"
                : "text-text-primary"
            }`}
          >
            {task.titleZh}
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
            {task.shortDescription}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            {task.highRisk && <HighRiskBadge />}
            {showStage && <StageBadge stageId={task.stageId} />}
            <span className="text-[11px] text-text-muted">{task.estimatedTime}</span>
            {skipped && <span className="text-[11px] text-text-muted">已跳过</span>}
          </div>
        </Link>

        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-text-muted" strokeWidth={1.75} />
      </div>
    </div>
  );
}
