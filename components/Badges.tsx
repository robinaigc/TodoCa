import type { Priority, StageId } from "@/types";
import { stageName } from "@/lib/stage";

const PRIORITY_STYLES: Record<Priority, string> = {
  P0: "bg-brand-soft text-brand",
  P1: "bg-[#f0f4f8] text-[#475569]",
  P2: "bg-[#f0f4f8] text-text-secondary",
};

const PRIORITY_LABELS: Record<Priority, string> = {
  P0: "必须做",
  P1: "建议做",
  P2: "可选",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[priority]}`}
    >
      {priority} · {PRIORITY_LABELS[priority]}
    </span>
  );
}

export function StageBadge({ stageId }: { stageId: StageId }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[11px] font-semibold text-[#475569]">
      {stageName(stageId)}
    </span>
  );
}

export function HighRiskBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#fff7ed] px-2.5 py-0.5 text-[11px] font-semibold text-[#c2410c]">
      高风险
    </span>
  );
}
