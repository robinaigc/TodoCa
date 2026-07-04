import type { Profile, ProgressMap, StageId, Task, TaskStatus } from "@/types";
import { TASKS } from "@/data/tasks";
import { computeStage, stagesUpTo } from "@/lib/stage";

const PRIORITY_ORDER = { P0: 0, P1: 1, P2: 2 } as const;

/** 判断某个任务是否适用于当前用户 */
export function isTaskApplicable(task: Task, profile: Profile): boolean {
  if (!task.identities.includes(profile.identity)) return false;

  const c = task.conditions;
  if (c) {
    if (c.requiresChildren === true && !profile.hasChildren) return false;
    if (c.requiresNoHousing === true && profile.hasHousing) return false;
    if (c.requiresCarPlan === true && !profile.hasCarPlan) return false;
  }
  return true;
}

/** 用户全部适用任务 */
export function applicableTasks(profile: Profile): Task[] {
  return TASKS.filter((t) => isTaskApplicable(t, profile));
}

export function taskStatus(progress: ProgressMap, taskId: string): TaskStatus {
  return progress[taskId]?.status ?? "not_started";
}

/** 排序：P0 > 当前阶段 > dayOffset 早 > 高风险 */
export function sortTasks(tasks: Task[], currentStage: StageId): Task[] {
  return [...tasks].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pa !== 0) return pa;
    const sa = (a.stageId === currentStage ? 0 : 1) - (b.stageId === currentStage ? 0 : 1);
    if (sa !== 0) return sa;
    if (a.dayOffset !== b.dayOffset) return a.dayOffset - b.dayOffset;
    return (b.highRisk ? 1 : 0) - (a.highRisk ? 1 : 0);
  });
}

export interface DashboardData {
  stageId: StageId;
  landedDays: number;
  isFinished: boolean;
  /** 今日聚焦：当前阶段未完成任务，按优先级取前 5 */
  todayTasks: Task[];
  /** 本阶段剩余（今日之外的） */
  weekTasks: Task[];
  /** 前面阶段漏掉的高优先级任务 */
  overdueTasks: Task[];
  /** 高风险未完成 */
  highRiskTasks: Task[];
  stageTotal: number;
  stageDone: number;
  totalTasks: number;
  totalDone: number;
  totalSkipped: number;
}

export function buildDashboard(profile: Profile, progress: ProgressMap, now: Date = new Date()): DashboardData {
  const { stageId, landedDays, isFinished } = computeStage(profile.landingDate, now);
  const all = applicableTasks(profile);

  const stageTasks = all.filter((t) => t.stageId === stageId);
  const stageDone = stageTasks.filter((t) => taskStatus(progress, t.id) === "completed").length;

  const pendingInStage = sortTasks(
    stageTasks.filter((t) => taskStatus(progress, t.id) === "not_started"),
    stageId
  );

  const prevStages = stagesUpTo(stageId).filter((s) => s !== stageId);
  const overdueTasks = sortTasks(
    all.filter(
      (t) =>
        prevStages.includes(t.stageId) &&
        t.priority === "P0" &&
        taskStatus(progress, t.id) === "not_started"
    ),
    stageId
  );

  const highRiskTasks = sortTasks(
    all.filter((t) => t.highRisk && taskStatus(progress, t.id) === "not_started"),
    stageId
  );

  const totalDone = all.filter((t) => taskStatus(progress, t.id) === "completed").length;
  const totalSkipped = all.filter((t) => taskStatus(progress, t.id) === "skipped").length;

  return {
    stageId,
    landedDays,
    isFinished,
    todayTasks: pendingInStage.slice(0, 5),
    weekTasks: pendingInStage.slice(5),
    overdueTasks,
    highRiskTasks,
    stageTotal: stageTasks.length,
    stageDone,
    totalTasks: all.length,
    totalDone,
    totalSkipped,
  };
}
