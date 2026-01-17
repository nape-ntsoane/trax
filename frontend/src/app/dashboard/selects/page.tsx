"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SelectsTable } from "@/components/selects-table"
import { useSelects, deleteSelect, updateSelect } from "@/hooks/use-selects"
import { toast } from "sonner"

export default function Page() {
  const { statuses, priorities, tags, mutate } = useSelects()

  const handleDelete = async (type: "tags" | "statuses" | "priorities", id: number) => {
    if (confirm(`Are you sure you want to delete this item?`)) {
      try {
        await deleteSelect(type, id)
        toast.success("Item deleted")
        mutate()
      } catch (error) {
        // Error is already handled by apiRequest, which shows a toast
      }
    }
  }

  const handleUpdate = async (type: "tags" | "statuses" | "priorities", id: number, data: any) => {
      await updateSelect(type, id, data)
      mutate()
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-6">
          <div className="space-y-8">
            <SelectsTable
              data={tags}
              title="Tags"
              onDelete={(id) => handleDelete("tags", id)}
              onUpdate={(id, data) => handleUpdate("tags", id, data)}
            />
            <SelectsTable
              data={statuses}
              title="Statuses"
              onDelete={(id) => handleDelete("statuses", id)}
              onUpdate={(id, data) => handleUpdate("statuses", id, data)}
            />
            <SelectsTable
              data={priorities}
              title="Priorities"
              onDelete={(id) => handleDelete("priorities", id)}
              onUpdate={(id, data) => handleUpdate("priorities", id, data)}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
