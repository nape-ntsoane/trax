"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SelectsTable } from "@/components/selects-table"
import { useSelects, deleteSelect, updateSelect, createSelect } from "@/hooks/use-selects"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconPlus } from "@tabler/icons-react"

export default function Page() {
  const { statuses, priorities, tags, mutate } = useSelects()
  const [title, setTitle] = React.useState("")
  const [color, setColor] = React.useState("")
  const [type, setType] = React.useState<"tags" | "statuses" | "priorities">("tags")
  const [creating, setCreating] = React.useState(false)

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
  
  const handleCreate = async () => {
      if (!title) {
          toast.error("Title is required")
          return
      }
      setCreating(true)
      try {
          await createSelect(type, { title, color })
          toast.success("Item created")
          setTitle("")
          setColor("")
          mutate()
      } catch (error) {
          // handled by apiRequest
      } finally {
          setCreating(false)
      }
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-8">
          {/* Top Form */}
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="grid gap-2 flex-1 w-full">
                <label className="text-sm font-medium">Title</label>
                <Input 
                    placeholder="e.g. Urgent" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className="grid gap-2 w-full sm:w-32">
                <label className="text-sm font-medium">Type</label>
                <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tags">Tag</SelectItem>
                        <SelectItem value="priorities">Priority</SelectItem>
                        <SelectItem value="statuses">Status</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2 w-full sm:w-32">
                <label className="text-sm font-medium">Color</label>
                <Select value={color} onValueChange={setColor}>
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
            <Button size="icon" className="shrink-0" onClick={handleCreate} disabled={creating}>
                <IconPlus className="h-4 w-4" />
                <span className="sr-only">Create</span>
            </Button>
          </div>

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
