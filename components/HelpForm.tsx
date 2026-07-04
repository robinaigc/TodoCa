"use client";

import { useState } from "react";
import type { LeadCategory } from "@/types";
import { getSupabase } from "@/lib/supabase";
import { loadProfile } from "@/lib/store";

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
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");
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

    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("service_leads").insert(lead);
      if (error) {
        setState("error");
        setErrorMsg("提交失败，请稍后再试，或直接发邮件联系我们。");
        return;
      }
    } else {
      // 未配置 Supabase 时降级为本地保存，便于开发调试
      const key = "todoca_leads_local";
      const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
      existing.push({ ...lead, created_at: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center dark:border-green-900 dark:bg-green-950/30">
        <p className="text-2xl">✅</p>
        <p className="mt-2 font-semibold text-green-800 dark:text-green-300">问题已提交</p>
        <p className="mt-1 text-sm text-green-700 dark:text-green-400">
          我们会根据问题类型尽快通过邮箱或微信联系你。
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-red-950";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">姓名 / 昵称 *</label>
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="怎么称呼你" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">邮箱 *</label>
        <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="用于回复你" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">微信号（可选）</label>
        <input className={inputCls} value={wechat} onChange={(e) => setWechat(e.target.value)} placeholder="方便的话留一个" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">问题类型</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                category === c.id
                  ? "border-red-500 bg-red-50 font-medium text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">问题描述 *</label>
        <textarea
          className={`${inputCls} min-h-28`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="用中文描述你的问题，越具体越好"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} className="h-4 w-4" />
        比较紧急，希望尽快联系我
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={willingToPay} onChange={(e) => setWillingToPay(e.target.checked)} className="h-4 w-4" />
        愿意预约付费咨询
      </label>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="w-full rounded-xl bg-red-600 py-3 text-[15px] font-semibold text-white active:bg-red-700 disabled:opacity-60"
      >
        {state === "submitting" ? "提交中…" : "提交我的问题"}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-neutral-400">
        提交即同意我们通过邮箱/微信联系你，你的信息仅用于本次协助，不会用于其他用途。
      </p>
    </form>
  );
}
