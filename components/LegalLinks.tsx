import Link from "next/link";

export default function LegalLinks({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="合规与支持"
      className={`flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs ${className}`}
    >
      <Link href="/privacy" className="link-brand">Privacy 隐私</Link>
      <Link href="/terms" className="link-brand">Terms 条款</Link>
      <Link href="/support" className="link-brand">Support 支持</Link>
    </nav>
  );
}
