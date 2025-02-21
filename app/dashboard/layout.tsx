import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SideNav } from "./_components/side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SideNav />
      <SidebarInset>
        <main className="container mx-auto px-3 py-12">
          <div className="w-full">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
