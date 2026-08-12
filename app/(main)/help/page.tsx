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
  const correctionMode = searchParams.get("mode") === "correction";
  const source = searchParams.get("source");
  const itemId = searchParams.get("item")?.slice(0, 80);
  const contentTitle = searchParams.get("title")?.slice(0, 120);
  const rawCategory = searchParams.get("category");
  const category = VALID_CATEGORIES.includes(rawCategory as LeadCategory)
    ? (rawCategory as LeadCategory)
    : undefined;
  const taskId = searchParams.get("task")?.slice(0, 100) ?? undefined;
  const validSource = source === "task" || source === "resource" ? source : undefined;
  const relatedContentId = correctionMode && validSource && itemId
    ? validSource === "resource"
      ? `resource:${itemId}`
      : itemId
    : taskId;
  const contentLabel = correctionMode && validSource && itemId
    ? `${validSource === "resource" ? "资源" : "任务"} ${itemId}${contentTitle ? ` · ${contentTitle}` : ""}`
    : undefined;

  return (
    <main>
      <PageHeader
        title={correctionMode ? "报告过期或错误信息" : "需要中文协助？"}
        subtitle={
          correctionMode
            ? `${contentTitle ? `你正在反馈“${contentTitle}”。` : ""}请告诉我们哪里已经变化；我们会核对官方来源后更新。`
            : "看不懂英文邮件、账单、租房合同、医保说明，或不知道下一步该怎么办？提交问题，我们会根据问题类型联系你。"
        }
      />
      <HelpForm
        defaultCategory={correctionMode ? "other" : category}
        relatedTaskId={relatedContentId}
        submissionKind={correctionMode ? "correction" : "help"}
        contentLabel={contentLabel}
      />
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
