"use client";

import { useState } from "react";
import { CircleCheck, TriangleAlert } from "lucide-react";
import type { LeadCategory } from "@/types";
import { getSupabase } from "@/lib/supabase";
import { loadProfile } from "@/lib/store";
import SupportEmailLink from "@/components/SupportEmailLink";

const CATEGORIES: { id: LeadCategory; label: string }[] = [
  { id: "housing", label: "租房" },
  { id: "health", label: "医保" },
  { id: "bill", label: "账单" },
  { id: "school", label: "学校" },
  { id: "bank", label: "银行" },
  { id: "phone", label: "电话卡" },
  { id: "sin", label: "SIN" },
  { id: "kids_school", label: "孩子入学" },
  { id: "english_mail", label: "看不懂英文邮件" },
  { id: "other", label: "其他" },
];

interface Props {
  defaultCategory?: LeadCategory;
  relatedTaskId?: string;
}

export default function HelpForm({ defaultCategory, relatedTaskId }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [wechat, setWechat] = useState("");
  const [category, setCategory] = useState<LeadCategory>(defaultCategory ?? "other");
  const [description, setDescription] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [willingToPay, setWillingToPay] = useState(false);
  const [state, setState] = useState<"idle" | "submitting" | "sent" | "saved-local" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !description.trim()) {
      setErrorMsg("请填写姓名、邮箱和问题描述。");
      return;
    }
    setErrorMsg("");
    setState("submitting");

    const profile = loadProfile();
    const lead = {
      name: name.trim(),
      email: email.trim(),
      wechat: wechat.trim() || null,
      identity_type: profile?.identity ?? null,
      city: "Vancouver",
      category,
      urgency: urgent ? "urgent" : "normal",
      willing_to_pay: willingToPay,
      description: description.trim(),
      related_task_id: relatedTaskId ?? null,
      status: "new",
    };

    function saveLocally() {
      const key = "todoca_leads_local";
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      const existing = Array.isArray(parsed) ? parsed : [];
      existing.push({ ...lead, created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    }

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from("service_leads").insert(lead);
        if (!error) {
          setState("sent");
          return;
        }
      } catch {
        // Network and SDK failures use the same clearly disclosed local fallback.
      }
    }

    try {
      saveLocally();
      setState("saved-local");
    } catch {
      setState("error");
      setErrorMsg("暂时无法发送或保存在此设备。请通过下方公开邮箱联系我们。");
    }
  }

  if (state === "sent") {
    return (
      <div className="card-soft bg-success-soft/60 p-6 text-center">
        <CircleCheck className="mx-auto h-8 w-8 text-success" aria-hidden="true" />
        <p className="mt-2 font-semibold text-success">问题已提交</p>
        <p className="mt-1 text-sm text-text-secondary">
          我们会根据问题类型尽快通过邮箱或微信联系你。
        </p>
      </div>
    );
  }

  if (state === "saved-local") {
    return (
      <div className="card-soft bg-brand-soft p-6 text-center">
        <TriangleAlert className="mx-auto h-8 w-8 text-brand" aria-hidden="true" />
        <p className="mt-2 font-semibold text-brand">仅保存在此设备，尚未发送</p>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          当前无法连接协助服务。你的内容已暂存在本浏览器，不会自动发送给我们。请发送邮件至：
        </p>
        <p className="mt-2 break-all text-sm"><SupportEmailLink className="font-semibold text-brand" /></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">姓名 / 昵称 *</label>
        <input
          className="input-soft"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="怎么称呼你"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">邮箱 *</label>
        <input
          className="input-soft"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="用于回复你"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">微信号（可选）</label>
        <input
          className="input-soft"
          value={wechat}
          onChange={(e) => setWechat(e.target.value)}
          placeholder="方便的话留一个"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">问题类型</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-3.5 py-1.5 text-sm transition ${
                category === c.id ? "pill-active" : "pill-inactive bg-white shadow-[var(--shadow-card-sm)]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-primary">问题描述 *</label>
        <textarea
          className="input-soft min-h-28 resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="用中文描述你的问题，越具体越好"
        />
      </div>
      <label className="flex min-h-11 items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={urgent}
          onChange={(e) => setUrgent(e.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        比较紧急，希望尽快联系我
      </label>
      <label className="flex min-h-11 items-center gap-2 text-sm text-text-secondary">
        <input
          type="checkbox"
          checked={willingToPay}
          onChange={(e) => setWillingToPay(e.target.checked)}
          className="h-4 w-4 accent-brand"
        />
        愿意预约付费咨询
      </label>

      {errorMsg && (
        <div className="text-sm text-brand">
          <p>{errorMsg}</p>
          {state === "error" && <p className="mt-1 break-all"><SupportEmailLink className="font-semibold" /></p>}
        </div>
      )}

      <button type="submit" disabled={state === "submitting"} className="btn-primary w-full py-3 text-[15px]">
        {state === "submitting" ? "提交中…" : "提交我的问题"}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-text-muted">
        提交即同意我们通过邮箱/微信联系你。信息仅用于联系你并回应本次协助请求；服务不可用时可能仅保存在本浏览器，并会明确提示。
      </p>
    </form>
  );
}
