"use client";

import Link from "next/link";
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
      className={`rounded-xl border p-3.5 ${
        completed
          ? "border-green-200 bg-green-50/60 dark:border-green-900 dark:bg-green-950/30"
          : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          aria-label={completed ? "已完成" : "标记完成"}
          onClick={() => onComplete?.(task.id)}
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm transition ${
            completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-neutral-300 text-transparent hover:border-green-400 dark:border-neutral-600"
          }`}
        >
          ✓
        </button>

        <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
          <p
            className={`text-[15px] font-medium leading-snug ${
              completed || skipped
                ? "text-neutral-400 line-through dark:text-neutral-500"
                : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {task.titleZh}
          </p>
          <p className="mt-1 line-clamp-2 text-[13px] text-neutral-500 dark:text-neutral-400">
            {task.shortDescription}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            {task.highRisk && <HighRiskBadge />}
            {showStage && <StageBadge stageId={task.stageId} />}
            <span className="text-[11px] text-neutral-400">⏱ {task.estimatedTime}</span>
            {skipped && <span className="text-[11px] text-neutral-400">已跳过</span>}
          </div>
        </Link>

        <span className="mt-1 text-neutral-300 dark:text-neutral-600">›</span>
      </div>
    </div>
  );
}
