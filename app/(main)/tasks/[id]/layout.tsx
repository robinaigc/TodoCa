import { TASKS } from "@/data/tasks";

export const dynamicParams = false;

export function generateStaticParams() {
  return TASKS.map((task) => ({ id: task.id }));
}

export default function TaskDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
