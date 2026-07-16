"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState, clearAllData } from "@/lib/store";
import { computeStage, stageName } from "@/lib/stage";
import { applicableTasks, taskStatus } from "@/lib/taskEngine";
import PageHeader from "@/components/PageHeader";
import type { IdentityType } from "@/types";

const IDENTITY_LABELS: Record<IdentityType, string> = {
  student: "留学生",
  work_permit: "工签人士",
  new_pr: "新 PR",
};

export default function ProfilePage() {
  const router = useRouter();
  const { ready, profile, progress } = useAppState();

  if (!ready) return <p className="py-20 text-center text-text-muted">加载中…</p>;

  if (!profile) {
    return (
      <main className="py-20 text-center">
        <p className="text-text-secondary">还没有设置个人信息。</p>
        <Link href="/onboarding" className="btn-primary mt-4 px-6 py-3 text-[15px]">
          开始设置
        </Link>
      </main>
    );
  }

  const stage = computeStage(profile.landingDate);
  const all = applicableTasks(profile);
  const done = all.filter((t) => taskStatus(progress, t.id) === "completed").length;
  const skipped = all.filter((t) => taskStatus(progress, t.id) === "skipped").length;

  return (
    <main>
      <PageHeader title="我的" />

      <section className="card-soft p-4">
        <Row label="身份" value={IDENTITY_LABELS[profile.identity]} />
        <Row label="目的地" value="温哥华 · BC 省 · 加拿大" />
        <Row label="登陆日期" value={profile.landingDate} />
        <Row label="当前阶段" value={stageName(stage.stageId)} />
        <Row label="带孩子" value={profile.hasChildren ? "是" : "否"} />
        <Row label="已有住房" value={profile.hasHousing ? "是" : "否"} />
        <Row label="有车" value={profile.hasCarPlan ? "是" : "否"} last />
      </section>

      <section className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="适用任务" value={all.length} />
        <Stat label="已完成" value={done} />
        <Stat label="已跳过" value={skipped} />
      </section>

      <div className="mt-6 space-y-3">
        <Link href="/onboarding" className="btn-secondary block w-full py-3.5 text-center text-[15px]">
          修改我的信息（重新生成清单）
        </Link>
        <Link href="/help" className="btn-secondary block w-full py-3.5 text-center text-[15px]">
          联系人工协助
        </Link>
        <button
          onClick={() => {
            if (confirm("确定要清除所有本地数据吗？任务进度将丢失。")) {
              clearAllData();
              router.push("/");
            }
          }}
          className="block w-full rounded-2xl bg-brand-soft py-3.5 text-center text-[15px] font-semibold text-brand"
        >
          清除所有数据
        </button>
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-text-muted">
        本产品提供一般生活信息和任务整理，不替代律师、医生、会计师、持牌移民顾问或其他专业人士的意见。
        <br />
        用户画像和任务进度保存在当前浏览器本地；协助表单仅在你主动提交时收集联系方式。
      </p>
    </main>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${
        last ? "" : "border-b border-[#eef1f6]"
      }`}
    >
      <span className="text-sm text-text-secondary">{label}</span>
      <span className="text-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-soft-sm p-3 text-center">
      <p className="text-xl font-bold text-brand">{value}</p>
      <p className="mt-0.5 text-xs text-text-secondary">{label}</p>
    </div>
  );
}
