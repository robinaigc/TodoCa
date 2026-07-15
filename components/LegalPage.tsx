import Link from "next/link";
import LegalLinks from "@/components/LegalLinks";

export default function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main className="surface-page mx-auto min-h-dvh max-w-lg px-5 pb-12 pt-8">
      <Link href="/" className="text-sm font-semibold text-brand">← 返回首页</Link>
      <header className="mt-6">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        <p className="mt-2 text-xs text-text-muted">最后更新：{updatedAt}</p>
      </header>
      <article className="mt-6 space-y-6 text-sm leading-7 text-text-secondary">
        {children}
      </article>
      <footer className="mt-10 border-t border-[#dfe3ea] pt-6">
        <LegalLinks />
      </footer>
    </main>
  );
}
