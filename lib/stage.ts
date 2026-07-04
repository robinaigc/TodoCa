import type { StageId } from "@/types";
import { STAGES } from "@/data/stages";

export interface StageInfo {
  stageId: StageId;
  /** 相对登陆日的天数，负数表示还没登陆 */
  landedDays: number;
  /** 落地期是否已结束（>180 天） */
  isFinished: boolean;
}

/** 按本地时区取当天 00:00 */
function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysSinceLanding(landingDate: string, now: Date = new Date()): number {
  const [y, m, d] = landingDate.split("-").map(Number);
  const landing = new Date(y, m - 1, d);
  const diffMs = startOfDay(now).getTime() - landing.getTime();
  return Math.floor(diffMs / 86400000);
}

export function computeStage(landingDate: string, now: Date = new Date()): StageInfo {
  const landedDays = daysSinceLanding(landingDate, now);

  if (landedDays < 0) {
    return { stageId: "pre_landing", landedDays, isFinished: false };
  }
  if (landedDays <= 7) return { stageId: "week_1", landedDays, isFinished: false };
  if (landedDays <= 30) return { stageId: "month_1", landedDays, isFinished: false };
  if (landedDays <= 90) return { stageId: "month_1_3", landedDays, isFinished: false };
  if (landedDays <= 180) return { stageId: "month_4_6", landedDays, isFinished: false };
  return { stageId: "month_4_6", landedDays, isFinished: true };
}

export function stageName(stageId: StageId): string {
  return STAGES.find((s) => s.id === stageId)?.nameZh ?? stageId;
}

/** 当前阶段及之前所有阶段（用于补漏未完成任务） */
export function stagesUpTo(stageId: StageId): StageId[] {
  const idx = STAGES.findIndex((s) => s.id === stageId);
  return STAGES.slice(0, idx + 1).map((s) => s.id);
}

export function nextStage(stageId: StageId): StageId | null {
  const idx = STAGES.findIndex((s) => s.id === stageId);
  return STAGES[idx + 1]?.id ?? null;
}
