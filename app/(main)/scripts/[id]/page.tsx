"use client";

import Link from "next/link";
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
      <Link href="/scripts" className="mb-3 inline-block text-sm text-neutral-500">
        ← 返回脚本库
      </Link>
      <h1 className="text-2xl font-bold">{script.titleZh}</h1>
      <p className="mt-2 text-[15px] text-neutral-600 dark:text-neutral-300">
        <span className="font-medium">场景：</span>
        {script.scenarioZh}
      </p>

      <ScriptBlock label="简短版（口语，照着说）" text={script.simpleEn} />
      <ScriptBlock label="完整版" text={script.fullEn} />
      {script.emailEn && <ScriptBlock label="正式邮件版" text={script.emailEn} />}

      {script.possibleReplies && script.possibleReplies.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[15px] font-bold">对方可能这样回答</h2>
          <ul className="space-y-2">
            {script.possibleReplies.map((r, i) => (
              <li key={i} className="rounded-xl bg-neutral-100 p-3 text-sm italic dark:bg-neutral-800">
                “{r}”
              </li>
            ))}
          </ul>
        </section>
      )}

      {script.fallbackPhrases && script.fallbackPhrases.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-[15px] font-bold">听不懂时可以说</h2>
          <ul className="space-y-2">
            {script.fallbackPhrases.map((p, i) => (
              <li key={i} className="rounded-xl bg-amber-50 p-3 text-sm italic text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                “{p}”
              </li>
            ))}
          </ul>
        </section>
      )}

      {relatedTask && (
        <Link
          href={`/tasks/${relatedTask.id}`}
          className="mt-8 block rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900"
        >
          📋 相关任务：<span className="font-semibold">{relatedTask.titleZh}</span> →
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
        <h2 className="text-[15px] font-bold">{label}</h2>
        <button onClick={copy} className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {copied ? "✓ 已复制" : "复制"}
        </button>
      </div>
      <blockquote className="rounded-xl border-l-4 border-blue-400 bg-blue-50 p-4 text-[15px] leading-relaxed text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        {text}
      </blockquote>
    </section>
  );
}
