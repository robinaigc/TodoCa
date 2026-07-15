import BottomNav from "@/components/BottomNav";
import LegalLinks from "@/components/LegalLinks";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-lg">
      <div className="px-4 pb-28 pt-6">
        {children}
        <footer className="mt-10 border-t border-[#dfe3ea] pt-6">
          <LegalLinks className="text-text-muted" />
        </footer>
      </div>
      <BottomNav />
    </div>
  );
}
