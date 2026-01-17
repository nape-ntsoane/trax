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
import { SelectsTable, type SelectItem } from "@/components/selects-table"
import { IconPlus } from "@tabler/icons-react"
import { apiRequest } from "@/lib/api"
import { endpoints } from "@/config/endpoints"
import { toast } from "sonner"

type SelectsResponse = {
  tags: SelectItem[]
  statuses: SelectItem[]
  priorities: SelectItem[]
}

export default function Page() {
  const [data, setData] = React.useState<SelectsResponse | null>(null)
  const [loading, setLoading] = React.useState(true)
  
  // Form state
  const [title, setTitle] = React.useState("")
  const [type, setType] = React.useState<"tag" | "priority" | "status">("tag")
  const [color, setColor] = React.useState("blue")
  const [creating, setCreating] = React.useState(false)

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiRequest(endpoints.selects.list)
      setData(res)
    } catch (error) {
      // Error handled by apiRequest
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    if (!title) {
        toast.error("Title is required")
        return
    }
    
    setCreating(true)
    try {
        let endpoint = ""
        if (type === "tag") endpoint = endpoints.selects.tags
        if (type === "status") endpoint = endpoints.selects.statuses
        if (type === "priority") endpoint = endpoints.selects.priorities
        
        await apiRequest(endpoint, {
            method: "POST",
            body: JSON.stringify({ title, color })
        })
        
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created`)
        setTitle("")
        fetchData()
    } catch (error) {
        // Error handled by apiRequest
    } finally {
        setCreating(false)
    }
  }

  const handleDelete = async (id: number, type: "tag" | "priority" | "status") => {
      try {
        let endpoint = ""
        if (type === "tag") endpoint = `${endpoints.selects.tags}/${id}`
        if (type === "status") endpoint = `${endpoints.selects.statuses}/${id}`
        if (type === "priority") endpoint = `${endpoints.selects.priorities}/${id}`

        await apiRequest(endpoint, { method: "DELETE" })
        toast.success("Item deleted")
        fetchData()
      } catch (error) {
          // Error handled by apiRequest
      }
  }

  if (loading && !data) {
      return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
  }

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
                        <SelectItem value="tag">Tag</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
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

          {/* Tables */}
          <div className="grid gap-8">
            <SelectsTable 
                title="Tags" 
                data={data?.tags || []} 
                onDelete={(id) => handleDelete(id, "tag")}
            />
            <SelectsTable 
                title="Priorities" 
                data={data?.priorities || []} 
                onDelete={(id) => handleDelete(id, "priority")}
            />
            <SelectsTable 
                title="Statuses" 
                data={data?.statuses || []} 
                onDelete={(id) => handleDelete(id, "status")}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
