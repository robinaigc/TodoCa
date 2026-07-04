import BottomNav from "@/components/BottomNav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg">
      <div className="px-4 pb-28 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
