"use client";

import Link from "next/link";
import {
  ChevronLeft,
  CircleCheck,
  CircleX,
  Clock3,
  ExternalLink,
  FileText,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { use } from "react";
import { notFound } from "next/navigation";
import { TASK_MAP } from "@/data/tasks";
import { SCRIPTS } from "@/data/scripts";
import { useAppState } from "@/lib/store";
import { taskStatus } from "@/lib/taskEngine";
import { HighRiskBadge, PriorityBadge, StageBadge } from "@/components/Badges";
import type { IdentityType, LeadCategory } from "@/types";

const IDENTITY_LABELS: Record<IdentityType, string> = {
  student: "留学生",
  work_permit: "工签",
  new_pr: "新 PR",
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const task = TASK_MAP[id];
  const { ready, progress, setTaskStatus } = useAppState();

  if (!task) notFound();

  const status = ready ? taskStatus(progress, task.id) : "not_started";
  const completed = status === "completed";
  const relatedScripts = SCRIPTS.filter((s) => s.relatedTaskId === task.id);

  return (
    <main className="pb-24">
      <Link
        href="/tasks"
        className="mb-4 inline-flex min-h-11 items-center gap-1 rounded-xl py-2 pr-3 pl-1 text-[15px] font-semibold text-text-secondary active:opacity-70"
      >
        <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} />
        返回任务列表
      </Link>

      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <StageBadge stageId={task.stageId} />
        {task.highRisk && <HighRiskBadge />}
      </div>
      <h1 className="text-2xl font-bold leading-snug text-text-primary">{task.titleZh}</h1>
      <p className="mt-0.5 text-sm text-text-muted">{task.titleEn}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-text-secondary">
        <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />预计 {task.estimatedTime}</span>
        <span className="inline-flex items-center gap-1"><UserRound className="h-3.5 w-3.5" aria-hidden="true" />适用：{task.identities.map((i) => IDENTITY_LABELS[i]).join("、")}</span>
      </div>

      <Section title="为什么要做">
        <p className="leading-relaxed">{task.whyItMatters}</p>
      </Section>

      {task.requiredDocs.length > 0 && (
        <Section title="所需材料">
          <ul className="space-y-1.5">
            {task.requiredDocs.map((d, i) => (
              <li key={i} className="flex gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="操作步骤">
        <ol className="space-y-2.5">
          {task.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-bold text-brand">
                {i + 1}
              </span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="完成标准">
        <div className="card-soft-sm flex items-start gap-2 bg-success-soft/50 p-4 text-success">
          <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{task.completionStandard}</span>
        </div>
      </Section>

      {task.commonMistakes.length > 0 && (
        <Section title="常见错误">
          <ul className="space-y-1.5">
            {task.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2">
                <CircleX className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {task.englishScript && (
        <Section title="英文对照">
          <blockquote className="card-soft-sm border-l-4 border-brand/30 p-4 text-[15px] italic leading-relaxed text-text-primary">
            “{task.englishScript}”
          </blockquote>
          {relatedScripts.length > 0 && (
            <div className="mt-2 space-y-1">
              {relatedScripts.map((s) => (
                <Link key={s.id} href={`/scripts/${s.id}`} className="link-brand flex items-center gap-1.5 text-sm">
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  更多对照：{s.titleZh} →
                </Link>
              ))}
            </div>
          )}
        </Section>
      )}

      {task.officialSources.length > 0 && (
        <Section title="官方来源">
          <ul className="space-y-1.5">
            {task.officialSources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-brand text-sm underline"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {s.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {task.serviceable && (
        <Section title="需要帮忙？">
          <div className="card-soft p-4">
            <p className="text-sm leading-relaxed text-text-secondary">
              材料不确定、英文沟通困难、看不懂官方页面？可以提交问题，有人用中文帮你。
            </p>
            <Link
              href={`/help?category=${(task.serviceCategory ?? "other") as LeadCategory}&task=${task.id}`}
              className="btn-primary mt-3 px-4 py-2.5 text-sm"
            >
              需要中文协助
            </Link>
          </div>
        </Section>
      )}

      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 bg-white px-4 py-3 shadow-[var(--shadow-nav)]">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={() => setTaskStatus(task.id, status === "skipped" ? "not_started" : "skipped")}
            className="btn-secondary px-4 py-3 text-sm text-text-secondary"
          >
            {status === "skipped" ? "取消跳过" : "暂时跳过"}
          </button>
          <button
            onClick={() => setTaskStatus(task.id, completed ? "not_started" : "completed")}
            className={`flex-1 rounded-2xl py-3 text-[15px] font-semibold text-white shadow-[var(--shadow-card-sm)] ${
              completed
                ? "bg-[var(--color-success)] active:opacity-90"
                : "btn-primary"
            }`}
          >
            {completed ? "✓ 已完成（点击撤销）" : "标记完成"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[15px] font-bold text-text-primary">{title}</h2>
      <div className="text-[15px] text-text-secondary">{children}</div>
    </section>
  );
}
