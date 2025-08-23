"use client"

import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/student');

  if (isDashboard) {
    return (
        <div className="flex min-h-screen">
          {children}
        </div>
    )
  }

  return <>{children}</>
}
