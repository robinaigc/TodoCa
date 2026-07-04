"use client";

import Link from "next/link";
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
      <Link href="/tasks" className="mb-3 inline-block text-sm text-neutral-500">
        ← 返回任务列表
      </Link>

      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <PriorityBadge priority={task.priority} />
        <StageBadge stageId={task.stageId} />
        {task.highRisk && <HighRiskBadge />}
      </div>
      <h1 className="text-2xl font-bold leading-snug">{task.titleZh}</h1>
      <p className="mt-0.5 text-sm text-neutral-400">{task.titleEn}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-500 dark:text-neutral-400">
        <span>⏱ 预计 {task.estimatedTime}</span>
        <span>👤 适用：{task.identities.map((i) => IDENTITY_LABELS[i]).join("、")}</span>
      </div>

      <Section title="为什么要做">
        <p className="leading-relaxed">{task.whyItMatters}</p>
      </Section>

      {task.requiredDocs.length > 0 && (
        <Section title="所需材料">
          <ul className="space-y-1.5">
            {task.requiredDocs.map((d, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-neutral-400">📄</span>
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
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-[13px] font-bold text-red-600 dark:bg-red-950 dark:text-red-300">
                {i + 1}
              </span>
              <span className="leading-relaxed">{s}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="完成标准">
        <div className="rounded-xl bg-green-50 p-3.5 text-green-800 dark:bg-green-950/40 dark:text-green-300">
          ✅ {task.completionStandard}
        </div>
      </Section>

      {task.commonMistakes.length > 0 && (
        <Section title="常见错误">
          <ul className="space-y-1.5">
            {task.commonMistakes.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span>❌</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {task.englishScript && (
        <Section title="英文脚本">
          <blockquote className="rounded-xl border-l-4 border-blue-400 bg-blue-50 p-3.5 text-[15px] italic leading-relaxed text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            “{task.englishScript}”
          </blockquote>
          {relatedScripts.length > 0 && (
            <div className="mt-2 space-y-1">
              {relatedScripts.map((s) => (
                <Link key={s.id} href={`/scripts/${s.id}`}
                  className="block text-sm font-medium text-blue-600 dark:text-blue-400">
                  💬 更多脚本：{s.titleZh} →
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
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 underline dark:text-blue-400">
                  🔗 {s.name}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {task.serviceable && (
        <Section title="需要帮忙？">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
            <p className="text-sm leading-relaxed">
              材料不确定、英文沟通困难、看不懂官方页面？可以提交问题，有人用中文帮你。
            </p>
            <Link
              href={`/help?category=${(task.serviceCategory ?? "other") as LeadCategory}&task=${task.id}`}
              className="mt-3 inline-block rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white active:bg-amber-600"
            >
              需要中文协助
            </Link>
          </div>
        </Section>
      )}

      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-neutral-200 bg-white/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-lg gap-3">
          <button
            onClick={() => setTaskStatus(task.id, status === "skipped" ? "not_started" : "skipped")}
            className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            {status === "skipped" ? "取消跳过" : "暂时跳过"}
          </button>
          <button
            onClick={() => setTaskStatus(task.id, completed ? "not_started" : "completed")}
            className={`flex-1 rounded-xl py-3 text-[15px] font-semibold text-white ${
              completed ? "bg-green-600 active:bg-green-700" : "bg-red-600 active:bg-red-700"
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
      <h2 className="mb-2 text-[15px] font-bold">{title}</h2>
      <div className="text-[15px] text-neutral-700 dark:text-neutral-300">{children}</div>
    </section>
  );
}
