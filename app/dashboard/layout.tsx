import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SideNav } from "./_components/side-nav/side-nav";
import { InstallPWAButton } from "@/components/pwa/install-pwa-button";
import { ConnectionStatus } from "@/components/pwa/connection-status";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SideNav />
      <SidebarInset>
        <main className="flex-1">
          <div className="w-full">{children}</div>
          <ConnectionStatus />
          <InstallPWAButton />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
