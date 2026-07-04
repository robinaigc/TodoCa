"use client";

import Link from "next/link";
import { useAppState } from "@/lib/store";

const FEATURES = [
  { icon: "📋", title: "个性化任务清单", desc: "按身份、登陆日期、家庭情况自动生成，打开就知道今天做什么。" },
  { icon: "🗓", title: "五个阶段全覆盖", desc: "登陆前 → 第一周 → 第一个月 → 1–3 个月 → 4–6 个月。" },
  { icon: "💬", title: "英文办事脚本", desc: "租房、银行、医保、诊所…照着说就行，还有邮件模板。" },
  { icon: "📍", title: "温哥华新人地图", desc: "Service Canada、银行、诊所、华人超市，办事地点一键导航。" },
  { icon: "🤝", title: "中文人工协助", desc: "看不懂、不敢办？提交问题，有人用中文帮你。" },
];

export default function LandingPage() {
  const { profile } = useAppState();
  const hasProfile = !!profile;

  return (
    <main className="mx-auto min-h-dvh max-w-lg px-5 pb-10">
      <div className="pt-14 text-center">
        <p className="text-5xl">🍁</p>
        <h1 className="mt-4 text-3xl font-bold">我要移民啦</h1>
        <p className="mt-2 text-[15px] text-neutral-500 dark:text-neutral-400">
          加拿大登陆前后 6 个月中文任务清单
        </p>
        <p className="mx-auto mt-5 max-w-sm text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-300">
          选择你的身份、城市和登陆日期，系统自动生成专属 Todo List。
          每一步该做什么、准备什么、去哪办、英文怎么说，都帮你列好。
        </p>

        <Link
          href={hasProfile ? "/dashboard" : "/onboarding"}
          className="mt-7 inline-block w-full rounded-2xl bg-red-600 py-4 text-center text-base font-semibold text-white shadow-lg shadow-red-200 active:bg-red-700 dark:shadow-none"
        >
          {hasProfile ? "继续我的登陆清单 →" : "开始生成我的登陆清单"}
        </Link>
        <p className="mt-3 text-xs text-neutral-400">
          无需注册 · 30 秒完成 · 适合留学生、工签人士、新 PR
        </p>
      </div>

      <div className="mt-12 space-y-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="flex items-start gap-3.5 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="font-semibold">{f.title}</p>
              <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-[11px] leading-relaxed text-neutral-400">
        本产品提供一般生活信息和任务整理，不替代律师、医生、会计师、持牌移民顾问或其他专业人士的意见。
        涉及移民、法律、医疗、税务、保险等问题，请咨询合资格专业人士或官方机构。
        <br />
        你的个人信息和任务进度保存在你的设备本地，我们不收集你的个人信息。
      </p>
    </main>
  );
}
