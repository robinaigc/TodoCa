import { RESOURCES } from "@/data/resources";

export const dynamicParams = false;

export function generateStaticParams() {
  return RESOURCES.map((resource) => ({ id: resource.id }));
}

export default function ResourceDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
