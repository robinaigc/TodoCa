import type { Priority, StageId } from "@/types";
import { stageName } from "@/lib/stage";

const PRIORITY_STYLES: Record<Priority, string> = {
  P0: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  P1: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  P2: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  P0: "必须做",
  P1: "建议做",
  P2: "可选",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${PRIORITY_STYLES[priority]}`}
    >
      {priority} · {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function StageBadge({ stageId }: { stageId: StageId }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      {stageName(stageId)}
    </span>
  );
}

export function HighRiskBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700 dark:bg-orange-950 dark:text-orange-300">
      ⚠️ 高风险
    </span>
  );
}
