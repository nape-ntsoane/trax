"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { IconCone } from "@tabler/icons-react"

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col items-center justify-center p-4 md:p-6 gap-6 text-center">
          <div className="rounded-full bg-muted p-6">
            <IconCone className="size-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Under Construction</h2>
            <p className="text-muted-foreground max-w-[500px]">
              We're working hard to bring you this feature. It's currently being built by our team of highly trained digital beavers. Check back soon!
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
