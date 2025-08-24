
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, LogOut } from "lucide-react"
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
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

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
  const { logout } = useAuth();

  return (
    <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
             <img src="/tbai.jpg" alt="Techno Billion AI Logo" className="h-8 w-8 rounded-md" />
            <span className="text-xl font-bold group-data-[collapsible=icon]:hidden">Techno Billion</span>
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
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="size-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
    </Sidebar>
  )
}
