"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useAppState } from "@/lib/store";
import { buildDashboard } from "@/lib/taskEngine";
import { stageName } from "@/lib/stage";
import TaskCard from "@/components/TaskCard";

export default function DashboardPage() {
  const router = useRouter();
  const { ready, profile, progress, setTaskStatus } = useAppState();

  useEffect(() => {
    if (ready && !profile) router.replace("/onboarding");
  }, [ready, profile, router]);

  const data = useMemo(
    () => (profile ? buildDashboard(profile, progress) : null),
    [profile, progress]
  );

  if (!ready || !profile || !data) {
    return <p className="py-20 text-center text-neutral-400">加载中…</p>;
  }

  const percent = data.stageTotal === 0 ? 100 : Math.round((data.stageDone / data.stageTotal) * 100);
  const dayText =
    data.landedDays < 0
      ? `距离登陆还有 ${-data.landedDays} 天`
      : data.isFinished
        ? "落地期已结束 🎉"
        : `已登陆第 ${data.landedDays + 1} 天`;

  return (
    <main>
      <header className="mb-5">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {dayText} · {stageName(data.stageId)}
        </p>
        <h1 className="mt-1 text-2xl font-bold">今天该做什么</h1>
      </header>

      <section className="mb-6 rounded-2xl bg-red-600 p-4 text-white">
        <div className="flex items-end justify-between">
          <p className="text-sm opacity-90">当前阶段进度</p>
          <p className="text-2xl font-bold">{percent}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
          <div className="h-full rounded-full bg-white transition-all" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-xs opacity-90">
          本阶段 {data.stageDone}/{data.stageTotal} 已完成 · 全部任务已完成 {data.totalDone}/{data.totalTasks}
        </p>
      </section>

      {data.overdueTasks.length > 0 && (
        <section className="mb-6">
          <SectionTitle icon="⏰" title="之前阶段还没完成的关键任务" />
          <div className="space-y-2.5">
            {data.overdueTasks.map((t) => (
              <TaskCard key={t.id} task={t} status="not_started" showStage
                onComplete={(id) => setTaskStatus(id, "completed")} />
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <SectionTitle icon="🔥" title={`今日聚焦（${data.todayTasks.length}）`} />
        {data.todayTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400 dark:border-neutral-700">
            {data.isFinished
              ? "恭喜完成 6 个月落地期！你仍然可以回顾所有任务。"
              : "你当前阶段没有待办任务。可以去任务页看看下一阶段，或检查高风险任务。"}
          </div>
        ) : (
          <div className="space-y-2.5">
            {data.todayTasks.map((t) => (
              <TaskCard key={t.id} task={t} status="not_started"
                onComplete={(id) => setTaskStatus(id, "completed")} />
            ))}
          </div>
        )}
      </section>

      {data.weekTasks.length > 0 && (
        <section className="mb-6">
          <SectionTitle icon="🗓" title="本阶段接下来" />
          <div className="space-y-2.5">
            {data.weekTasks.slice(0, 5).map((t) => (
              <TaskCard key={t.id} task={t} status="not_started"
                onComplete={(id) => setTaskStatus(id, "completed")} />
            ))}
          </div>
          {data.weekTasks.length > 5 && (
            <Link href="/tasks" className="mt-3 block text-center text-sm font-medium text-red-600 dark:text-red-400">
              查看全部任务 →
            </Link>
          )}
        </section>
      )}

      <section className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
        <p className="font-semibold">看不懂？不敢办？需要中文协助？</p>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
          英文邮件、账单、租房合同、医保说明…提交问题，有人用中文帮你。
        </p>
        <Link href="/help"
          className="mt-3 inline-block rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white active:bg-amber-600">
          提交我的问题
        </Link>
      </section>
    </main>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-1.5 text-[15px] font-bold">
      <span>{icon}</span>
      {title}
    </h2>
  );
}
