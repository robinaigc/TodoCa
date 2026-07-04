export type IdentityType = "student" | "work_permit" | "new_pr";

export type StageId =
  | "pre_landing"
  | "week_1"
  | "month_1"
  | "month_1_3"
  | "month_4_6";

export type Priority = "P0" | "P1" | "P2";

export interface Stage {
  id: StageId;
  nameZh: string;
  nameEn: string;
  /** 相对登陆日的起始天数（登陆日为第 0 天），pre_landing 用负数表示 */
  startDay: number;
  endDay: number;
  description: string;
  sortOrder: number;
}

export interface OfficialSource {
  name: string;
  url: string;
}

/** 任务显示条件，未设置的键不参与过滤 */
export interface TaskConditions {
  requiresChildren?: boolean;
  requiresNoHousing?: boolean;
  requiresCarPlan?: boolean;
}

export interface Task {
  id: string;
  titleZh: string;
  titleEn: string;
  stageId: StageId;
  priority: Priority;
  highRisk?: boolean;
  serviceable?: boolean;
  serviceCategory?: string;
  identities: IdentityType[];
  estimatedTime: string;
  /** 建议完成日（相对登陆日的偏移，负数为登陆前），用于排序 */
  dayOffset: number;
  shortDescription: string;
  whyItMatters: string;
  requiredDocs: string[];
  steps: string[];
  completionStandard: string;
  commonMistakes: string[];
  officialSources: OfficialSource[];
  englishScript?: string;
  conditions?: TaskConditions;
}

export type ScriptCategory =
  | "housing"
  | "bank"
  | "health"
  | "school"
  | "clinic"
  | "phone"
  | "government"
  | "mail"
  | "work"
  | "general";

export interface Script {
  id: string;
  category: ScriptCategory;
  titleZh: string;
  scenarioZh: string;
  simpleEn: string;
  fullEn: string;
  emailEn?: string;
  possibleReplies?: string[];
  fallbackPhrases?: string[];
  relatedTaskId?: string;
}

export type ResourceCategory =
  | "government"
  | "bank"
  | "pharmacy"
  | "clinic"
  | "urgent_care"
  | "library"
  | "community"
  | "chinese_market"
  | "budget_market"
  | "transit"
  | "settlement";

export interface MapResource {
  id: string;
  name: string;
  category: ResourceCategory;
  address: string;
  phone?: string;
  website?: string;
  descriptionZh: string;
  notesZh?: string;
  isOfficial?: boolean;
  /** 最近一次人工核对信息的时间（YYYY-MM），V2 文档 §4.5 预留 */
  lastVerified?: string;
}

export type TopConcern =
  | "dont_know_start"
  | "housing"
  | "health"
  | "english"
  | "money"
  | "school_kids"
  | "job"
  | "other";

export interface Profile {
  identity: IdentityType;
  landingDate: string; // YYYY-MM-DD
  hasLanded: boolean;
  hasChildren: boolean;
  hasHousing: boolean;
  hasCarPlan: boolean;
  /** 用户最担心的问题（可多选） */
  topConcerns: TopConcern[];
  preferredName?: string;
  createdAt: string;
}

export type TaskStatus = "not_started" | "completed" | "skipped";

export interface TaskProgressEntry {
  status: TaskStatus;
  updatedAt: string;
}

export type ProgressMap = Record<string, TaskProgressEntry>;

export type LeadCategory =
  | "housing"
  | "health"
  | "bill"
  | "school"
  | "bank"
  | "phone"
  | "sin"
  | "kids_school"
  | "english_mail"
  | "other";
