"use client"

import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconMail,
  IconSearch,
  IconSettings,
  IconTags,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { brand } from "@/config/brand"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Analytics",
      url: "/under-construction",
      icon: IconChartBar,
    },
    {
      title: "Email Sync",
      url: "/under-construction",
      icon: IconMail,
    },
    {
      title: "Tags, Priorities & Statuses",
      url: "/selects",
      icon: IconTags,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="gap-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-0 h-12"
            >
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image src={brand.logo} alt={`${brand.name} logo`} width={32} height={32} className="rounded-lg border-2 border-white/20 shadow-lg" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-lg">{brand.name}</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-xs text-center text-muted-foreground">
          Product of {brand.company}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
