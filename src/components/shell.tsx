"use client"

import { useAuth } from "@/hooks/use-auth"
import { SidebarProvider } from "@/components/ui/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, userRole } = useAuth()
  const isDashboard = user && userRole

  if (isDashboard) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          {children}
        </div>
      </SidebarProvider>
    )
  }

  return <>{children}</>
}
