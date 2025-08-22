"use client"

import { useAuth } from "@/hooks/use-auth"
import { SidebarProvider } from "@/components/ui/sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  if (user) {
    return (
      <SidebarProvider>
        <div className="flex">
          {children}
        </div>
      </SidebarProvider>
    )
  }

  return <>{children}</>
}
