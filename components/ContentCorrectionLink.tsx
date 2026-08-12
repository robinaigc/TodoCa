import Link from "next/link";
import { Flag } from "lucide-react";

interface Props {
  contentType: "task" | "resource";
  contentId: string;
  title: string;
  className?: string;
}

export default function ContentCorrectionLink({
  contentType,
  contentId,
  title,
  className = "",
}: Props) {
  return (
    <Link
      href={{
        pathname: "/help",
        query: {
          mode: "correction",
          source: contentType,
          item: contentId,
          title,
        },
      }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-text-secondary active:bg-surface-muted ${className}`}
    >
      <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />
      发现信息有误或已经过期
    </Link>
  );
}
