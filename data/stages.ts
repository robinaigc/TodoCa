import type { Stage, StageId } from "@/types";

export const STAGES: Stage[] = [
  {
    id: "pre_landing",
    nameZh: "登陆前",
    nameEn: "Before Landing",
    startDay: -365,
    endDay: -1,
    description: "带齐文件、准备预算、安排临时住宿，知道落地第一周要做什么。",
    sortOrder: 1,
  },
  {
    id: "week_1",
    nameZh: "登陆后一周",
    nameEn: "First Week",
    startDay: 0,
    endDay: 7,
    description: "完成生存级基础设施：电话卡、银行、SIN、医保、交通。",
    sortOrder: 2,
  },
  {
    id: "month_1",
    nameZh: "登陆后一个月",
    nameEn: "First Month",
    startDay: 8,
    endDay: 30,
    description: "从临时生活进入稳定生活：长期租房、信用记录、孩子入学。",
    sortOrder: 3,
  },
  {
    id: "month_1_3",
    nameZh: "登陆后 1–3 个月",
    nameEn: "Month 1–3",
    startDay: 31,
    endDay: 90,
    description: "建立本地生活节奏：驾照、找工作、家庭医生、社区资源。",
    sortOrder: 4,
  },
  {
    id: "month_4_6",
    nameZh: "登陆后 4–6 个月",
    nameEn: "Month 4–6",
    startDay: 91,
    endDay: 180,
    description: "完成落地期收尾：报税准备、生活成本复盘、6 个月安顿检查。",
    sortOrder: 5,
  },
];

export const STAGE_MAP: Record<StageId, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s])
) as Record<StageId, Stage>;
