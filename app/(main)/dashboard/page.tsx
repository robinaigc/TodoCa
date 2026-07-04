"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, type ComponentType } from "react";
import { AlarmClock, CalendarDays, Flame } from "lucide-react";
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
    return <p className="py-20 text-center text-text-muted">加载中…</p>;
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
        <p className="text-sm text-text-secondary">
          {dayText} · {stageName(data.stageId)}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary">今天该做什么</h1>
      </header>

      <section className="card-soft mb-6 p-5">
        <div className="flex items-end justify-between">
          <p className="text-sm font-medium text-text-secondary">当前阶段进度</p>
          <p className="text-3xl font-bold text-brand">{percent}%</p>
        </div>
        <div className="progress-track mt-3">
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-3 text-xs text-text-muted">
          本阶段 {data.stageDone}/{data.stageTotal} 已完成 · 全部任务已完成 {data.totalDone}/{data.totalTasks}
        </p>
      </section>

      {data.overdueTasks.length > 0 && (
        <section className="mb-6">
          <SectionTitle icon={AlarmClock} title="之前阶段还没完成的关键任务" />
          <div className="space-y-3">
            {data.overdueTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                status="not_started"
                showStage
                onComplete={(id) => setTaskStatus(id, "completed")}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <SectionTitle icon={Flame} title={`今日聚焦（${data.todayTasks.length}）`} />
        {data.todayTasks.length === 0 ? (
          <div className="card-soft-sm border border-dashed border-[#e4e8ef] p-6 text-center text-sm text-text-muted">
            {data.isFinished
              ? "恭喜完成 6 个月落地期！你仍然可以回顾所有任务。"
              : "你当前阶段没有待办任务。可以去任务页看看下一阶段，或检查高风险任务。"}
          </div>
        ) : (
          <div className="space-y-3">
            {data.todayTasks.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                status="not_started"
                onComplete={(id) => setTaskStatus(id, "completed")}
              />
            ))}
          </div>
        )}
      </section>

      {data.weekTasks.length > 0 && (
        <section className="mb-6">
          <SectionTitle icon={CalendarDays} title="本阶段接下来" />
          <div className="space-y-3">
            {data.weekTasks.slice(0, 5).map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                status="not_started"
                onComplete={(id) => setTaskStatus(id, "completed")}
              />
            ))}
          </div>
          {data.weekTasks.length > 5 && (
            <Link href="/tasks" className="link-brand mt-4 block text-center text-sm">
              查看全部任务 →
            </Link>
          )}
        </section>
      )}

      <section className="card-soft p-5">
        <p className="font-semibold text-text-primary">看不懂？不敢办？需要中文协助？</p>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          英文邮件、账单、租房合同、医保说明…提交问题，有人用中文帮你。
        </p>
        <Link href="/help" className="btn-primary mt-4 px-5 py-2.5 text-sm">
          提交我的问题
        </Link>
      </section>
    </main>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
}) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-[15px] font-bold text-text-primary">
      <Icon className="h-[18px] w-[18px] text-brand" strokeWidth={2} />
      {title}
    </h2>
  );
}
