"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { use, useState } from "react";
import { notFound } from "next/navigation";
import { SCRIPT_MAP } from "@/data/scripts";
import { TASK_MAP } from "@/data/tasks";

export default function ScriptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const script = SCRIPT_MAP[id];
  if (!script) notFound();

  const relatedTask = script.relatedTaskId ? TASK_MAP[script.relatedTaskId] : null;

  return (
    <main className="pb-8">
      <Link
        href="/scripts"
        className="mb-4 inline-flex min-h-11 items-center gap-1 rounded-xl py-2 pr-3 pl-1 text-[15px] font-semibold text-text-secondary active:opacity-70"
      >
        <ChevronLeft className="h-6 w-6 shrink-0" strokeWidth={2.25} />
        返回对照库
      </Link>
      <h1 className="text-2xl font-bold text-text-primary">{script.titleZh}</h1>
      <p className="mt-2 text-[15px] text-text-secondary">
        <span className="font-medium text-text-primary">场景：</span>
        {script.scenarioZh}
      </p>

      <ScriptBlock label="简短版（口语，照着说）" text={script.simpleEn} />
      <ScriptBlock label="完整版" text={script.fullEn} />
      {script.emailEn && <ScriptBlock label="正式邮件版" text={script.emailEn} />}

      {script.possibleReplies && script.possibleReplies.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[15px] font-bold text-text-primary">对方可能这样回答</h2>
          <ul className="space-y-2">
            {script.possibleReplies.map((r, i) => (
              <li key={i} className="card-soft-sm p-3 text-sm italic text-text-secondary">
                “{r}”
              </li>
            ))}
          </ul>
        </section>
      )}

      {script.fallbackPhrases && script.fallbackPhrases.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[15px] font-bold text-text-primary">听不懂时可以说</h2>
          <ul className="space-y-2">
            {script.fallbackPhrases.map((p, i) => (
              <li key={i} className="card-soft-sm bg-brand-soft/50 p-3 text-sm italic text-brand">
                “{p}”
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedTask && (
        <Link href={`/tasks/${relatedTask.id}`} className="list-row mt-8 text-sm">
          📋 相关任务：<span className="font-semibold text-text-primary">{relatedTask.titleZh}</span> →
        </Link>
      )}
    </main>
  );
}

function ScriptBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 剪贴板不可用时忽略
    }
  }

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-text-primary">{label}</h2>
        <button onClick={copy} className="link-brand text-sm">
          {copied ? "✓ 已复制" : "复制"}
        </button>
      </div>
      <blockquote className="card-soft-sm border-l-4 border-brand/30 p-4 text-[15px] leading-relaxed text-text-primary">
        {text}
      </blockquote>
    </section>
  );
}
