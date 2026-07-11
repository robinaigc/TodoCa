import { SUPPORT_EMAIL } from "@/lib/publicConfig";

export default function SupportEmailLink({ className = "" }: { className?: string }) {
  return (
    <a className={className} href={`mailto:${SUPPORT_EMAIL}`}>
      {SUPPORT_EMAIL}
    </a>
  );
}
