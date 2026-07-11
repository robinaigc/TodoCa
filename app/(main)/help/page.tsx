"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HelpForm from "@/components/HelpForm";
import PageHeader from "@/components/PageHeader";
import type { LeadCategory } from "@/types";
import SupportEmailLink from "@/components/SupportEmailLink";

const VALID_CATEGORIES: LeadCategory[] = [
  "housing", "health", "bill", "school", "bank", "phone", "sin", "kids_school", "english_mail", "other",
];

function HelpContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category");
  const category = VALID_CATEGORIES.includes(rawCategory as LeadCategory)
    ? (rawCategory as LeadCategory)
    : undefined;
  const taskId = searchParams.get("task") ?? undefined;

  return (
    <main>
      <PageHeader
        title="需要中文协助？"
        subtitle="看不懂英文邮件、账单、租房合同、医保说明，或不知道下一步该怎么办？提交问题，我们会根据问题类型联系你。"
      />
      <HelpForm defaultCategory={category} relatedTaskId={taskId} />
      <p className="mt-6 text-center text-[11px] leading-relaxed text-text-muted">
        本服务提供一般生活信息协助，不构成法律、医疗、税务或移民专业意见。
        <br />公开联系邮箱：<SupportEmailLink className="font-semibold text-brand" />
      </p>
    </main>
  );
}

export default function HelpPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-text-muted">加载中…</p>}>
      <HelpContent />
    </Suspense>
  );
}
