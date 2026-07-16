"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import type { IdentityType, Profile, TopConcern } from "@/types";
import { loadProfile, setProfile } from "@/lib/store";

const IDENTITIES: { id: IdentityType; label: string; desc: string; icon: LucideIcon }[] = [
  { id: "student", label: "留学生", desc: "持学签来读书", icon: GraduationCap },
  { id: "work_permit", label: "工签人士", desc: "持工签来工作", icon: BriefcaseBusiness },
  { id: "new_pr", label: "新 PR", desc: "持 COPR / PR 卡登陆", icon: BadgeCheck },
];

const CONCERNS: { id: TopConcern; label: string }[] = [
  { id: "dont_know_start", label: "不知道先做什么" },
  { id: "housing", label: "租房" },
  { id: "health", label: "医保和看病" },
  { id: "english", label: "英语沟通" },
  { id: "money", label: "银行和钱" },
  { id: "school_kids", label: "孩子入学" },
  { id: "job", label: "找工作" },
  { id: "other", label: "其他" },
];

type YesNo = boolean | null;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [identity, setIdentity] = useState<IdentityType | null>(null);
  const [landingDate, setLandingDate] = useState("");
  const [hasLanded, setHasLanded] = useState<YesNo>(null);
  const [hasChildren, setHasChildren] = useState<YesNo>(null);
  const [hasHousing, setHasHousing] = useState<YesNo>(null);
  const [hasCarPlan, setHasCarPlan] = useState<YesNo>(null);
  const [topConcerns, setTopConcerns] = useState<TopConcern[]>([]);

  function toggleConcern(id: TopConcern) {
    setTopConcerns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  const steps = [
    {
      title: "你当前的身份是？",
      valid: identity !== null,
      body: (
        <div className="space-y-3">
          {IDENTITIES.map((i) => (
            <ChoiceCard
              key={i.id}
              active={identity === i.id}
              onClick={() => setIdentity(i.id)}
              label={i.label}
              desc={i.desc}
              icon={i.icon}
            />
          ))}
        </div>
      ),
    },
    {
      title: "你的登陆日期是？",
      valid: landingDate !== "" && hasLanded !== null,
      body: (
        <div className="space-y-5">
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm text-text-secondary">
              目的地暂时只开放：
              <MapPin className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
              温哥华（BC 省）
            </p>
            <input
              type="date"
              value={landingDate}
              onChange={(e) => setLandingDate(e.target.value)}
              className="input-soft"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">你已经登陆了吗？</p>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceCard active={hasLanded === false} onClick={() => setHasLanded(false)} label="还没出发" />
              <ChoiceCard active={hasLanded === true} onClick={() => setHasLanded(true)} label="已经登陆" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "关于你的家庭情况",
      valid: hasChildren !== null && hasHousing !== null && hasCarPlan !== null,
      body: (
        <div className="space-y-5">
          <YesNoRow label="是否带孩子一起？" value={hasChildren} onChange={setHasChildren} />
          <YesNoRow label="是否已有长期住房？" value={hasHousing} onChange={setHasHousing} />
          <YesNoRow label="是否有车或计划开车？" value={hasCarPlan} onChange={setHasCarPlan} />
        </div>
      ),
    },
    {
      title: "你现在最担心什么？（可多选）",
      valid: topConcerns.length > 0,
      body: (
        <div>
          <div className="grid grid-cols-2 gap-3">
            {CONCERNS.map((c) => (
              <ChoiceCard
                key={c.id}
                active={topConcerns.includes(c.id)}
                onClick={() => toggleConcern(c.id)}
                label={c.label}
                checked={topConcerns.includes(c.id)}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-text-muted">
            已选 {topConcerns.length} 项，可继续多选或取消
          </p>
        </div>
      ),
    },
  ];

  function finish() {
    const existing = loadProfile();
    const newProfile: Profile = {
      identity: identity!,
      landingDate,
      hasLanded: hasLanded!,
      hasChildren: hasChildren!,
      hasHousing: hasHousing!,
      hasCarPlan: hasCarPlan!,
      topConcerns,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    setProfile(newProfile);
    router.push("/dashboard");
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <main className="surface-page mx-auto flex h-[calc(100dvh-env(safe-area-inset-top))] max-w-lg flex-col overflow-y-auto px-5 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-8">
      <div className="mb-6 flex items-center gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? "bg-brand" : "bg-surface-muted"
            }`}
          />
        ))}
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-text-primary">{current.title}</h1>
      <div className="mt-6 flex-1">{current.body}</div>

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="btn-secondary px-5 py-3.5 text-[15px]">
            上一步
          </button>
        )}
        <button
          disabled={!current.valid}
          onClick={() => (isLast ? finish() : setStep(step + 1))}
          className="btn-primary flex-1 py-3.5 text-[15px]"
        >
          {isLast ? (
            <span className="inline-flex items-center gap-2">
              生成我的登陆清单
              <PartyPopper className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : (
            "下一步"
          )}
        </button>
      </div>
    </main>
  );
}

function ChoiceCard({
  active,
  onClick,
  label,
  desc,
  checked,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
  /** 多选场景：显示勾选标记 */
  checked?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`choice-card ${active ? "choice-card-active" : ""}`}
    >
      <p className="flex items-center justify-between text-[15px] font-semibold text-text-primary">
        <span className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 shrink-0 text-brand" strokeWidth={2} aria-hidden="true" />}
          {label}
        </span>
        {checked && <span className="text-brand">✓</span>}
      </p>
      {desc && <p className="mt-0.5 text-sm text-text-secondary">{desc}</p>}
    </button>
  );
}

function YesNoRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <ChoiceCard active={value === true} onClick={() => onChange(true)} label="是" />
        <ChoiceCard active={value === false} onClick={() => onChange(false)} label="否" />
      </div>
    </div>
  );
}
