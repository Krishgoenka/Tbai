"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

type IconName = keyof typeof LucideIcons;

interface DashboardSidebarProps {
  navItems: {
    href: string;
    icon: IconName;
    label: string;
  }[];
}

const isIconName = (name: string): name is IconName => {
  return name in LucideIcons;
}

export function DashboardSidebar({ navItems }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">TechnoBillion</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = isIconName(item.icon) ? LucideIcons[item.icon] : LucideIcons.HelpCircle;
              return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    side: "right",
                  }}
                >
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )})}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Link href="/login" className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out size-4 shrink-0"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </Link>
          </Button>
        </SidebarFooter>
    </Sidebar>
  )
}
