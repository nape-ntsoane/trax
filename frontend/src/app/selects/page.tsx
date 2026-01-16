"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectsTable } from "@/components/selects-table"
import { IconPlus } from "@tabler/icons-react"

import mockData from "./mock-data.json"

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
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-8">
          {/* Top Form */}
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="grid gap-2 flex-1 w-full">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="e.g. Urgent" />
            </div>
            <div className="grid gap-2 w-full sm:w-32">
                <label className="text-sm font-medium">Type</label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tag">Tag</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2 w-full sm:w-32">
                <label className="text-sm font-medium">Color</label>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="red">Red</SelectItem>
                        <SelectItem value="blue">Blue</SelectItem>
                        <SelectItem value="green">Green</SelectItem>
                        <SelectItem value="yellow">Yellow</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="purple">Purple</SelectItem>
                        <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button size="icon" className="shrink-0">
                <IconPlus className="h-4 w-4" />
                <span className="sr-only">Create</span>
            </Button>
          </div>

          {/* Tables */}
          <div className="grid gap-8">
            <SelectsTable title="Tags" data={mockData.tags} />
            <SelectsTable title="Priorities" data={mockData.priorities} />
            <SelectsTable title="Statuses" data={mockData.statuses} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
