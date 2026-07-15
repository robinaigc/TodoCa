"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarRange,
  ClipboardList,
  HandHelping,
  MapPin,
  MessageSquareText,
  type LucideIcon,
} from "lucide-react";
import { useAppState } from "@/lib/store";
import LegalLinks from "@/components/LegalLinks";

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: ClipboardList,
    title: "个性化任务清单",
    desc: "按身份、登陆日期、家庭情况自动生成，打开就知道今天做什么。",
  },
  {
    icon: CalendarRange,
    title: "五个阶段全覆盖",
    desc: "登陆前 → 第一周 → 第一个月 → 1–3 个月 → 4–6 个月。",
  },
  {
    icon: MessageSquareText,
    title: "英文办事对照",
    desc: "租房、银行、医保、诊所…照着说就行，还有邮件模板。",
  },
  {
    icon: MapPin,
    title: "温哥华生活导航",
    desc: "Service Canada、银行、诊所、华人超市，办事地点一键导航；华人本地服务即将开放。",
  },
  {
    icon: HandHelping,
    title: "中文人工协助",
    desc: "看不懂、不敢办？提交问题，有人用中文帮你。",
  },
];

export default function LandingPage() {
  const { profile } = useAppState();
  const hasProfile = !!profile;

  return (
    <main className="surface-page mx-auto max-w-lg px-5 pb-12">
      <div className="pt-14 text-center">
        <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center">
          <Image
            src="/logo.png"
            alt="我要移民啦 TodoCa"
            width={88}
            height={88}
            priority
            className="h-[88px] w-[88px] rounded-[22px] object-cover shadow-[var(--shadow-card-sm)]"
          />
        </div>

        <div className="mx-auto mt-6 text-center">
          <h1 className="text-[1.75rem] font-bold leading-tight tracking-wide text-text-primary">
            我要移民啦
          </h1>
          <p
            className="mt-1.5 text-center text-[0.9375rem] font-semibold text-black"
            style={{ fontFamily: "var(--font-rounded)" }}
          >
            TodoCa
          </p>
        </div>

        <p className="mt-3 text-[15px] text-text-secondary">加拿大登陆前后 6 个月中文任务清单</p>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-text-secondary">
          选择你的身份、城市和登陆日期，系统自动生成专属 Todo List。
          每一步该做什么、准备什么、去哪办、英文怎么说，都帮你列好。
        </p>

        <Link
          href={hasProfile ? "/dashboard" : "/onboarding"}
          className="btn-primary mt-8 w-full py-4 text-base"
        >
          {hasProfile ? "继续我的登陆清单 →" : "开始生成我的登陆清单"}
        </Link>
        <p className="mt-3 text-xs text-text-muted">
          无需注册 · 30 秒完成 · 适合留学生、工签人士、新 PR
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="card-soft flex items-start gap-4 p-4">
              <div className="icon-circle">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="font-semibold text-text-primary">{f.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="mt-10 border-t border-[#dfe3ea] pt-6">
        <LegalLinks />
        <p className="mt-4 text-center text-[11px] leading-relaxed text-text-muted">
          本产品提供一般生活信息和任务整理，不替代律师、医生、会计师、持牌移民顾问或其他专业人士的意见。
          涉及移民、法律、医疗、税务、保险等问题，请咨询合资格专业人士或官方机构。
          <br />
          你的用户画像和任务进度保存在当前浏览器本地；协助表单仅在你主动提交时收集联系方式。
        </p>
      </footer>
    </main>
  );
}
