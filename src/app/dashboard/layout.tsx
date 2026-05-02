import { AppHeader } from "@/components/layout/app-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
