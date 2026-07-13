import { SCRIPTS } from "@/data/scripts";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCRIPTS.map((script) => ({ id: script.id }));
}

export default function ScriptDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
