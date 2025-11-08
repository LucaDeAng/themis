import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { DashboardTour } from '@/components/dashboard-tour'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <DashboardTour />
          <div className="container py-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
