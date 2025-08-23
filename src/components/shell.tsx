"use client"

import { useAuth } from "@/hooks/use-auth"
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, userRole, loading } = useAuth()
  const pathname = usePathname();

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <p>Loading...</p>
        </div>
    )
  }
  
  const isDashboard = user && userRole && (pathname.startsWith('/admin') || pathname.startsWith('/student'));

  if (isDashboard) {
    return (
        <div className="flex min-h-screen">
          {children}
        </div>
    )
  }

  return <>{children}</>
}
