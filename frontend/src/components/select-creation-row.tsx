"use client"

import * as React from "react"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { createSelect } from "@/hooks/use-selects"

interface SelectCreationRowProps {
    onCreated: () => void
}

export function SelectCreationRow({ onCreated }: SelectCreationRowProps) {
    const [title, setTitle] = React.useState("")
    const [color, setColor] = React.useState("")
    const [type, setType] = React.useState<"tags" | "statuses" | "priorities">("tags")

    const handleCreate = async () => {
        if (!title) {
            toast.error("Title is required")
            return
        }
        try {
            await createSelect(type, { title, color })
            toast.success("Item created")
            setTitle("")
            setColor("")
            onCreated()
        } catch (error) {
            // handled by apiRequest
        }
    }

    return (
        <div className="flex items-end justify-between gap-2 p-4 border rounded-lg bg-muted/40">
            {/* Title field on the left, taking up most space */}
            <div className="grid gap-2 flex-1">
                <span className="text-sm font-medium leading-none">Title</span>
                <Input 
                    placeholder="e.g. Urgent" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
            </div>

            {/* Group of controls on the right, taking minimal space */}
            <div className="flex items-end gap-2">
                <div className="grid gap-2 w-[120px]">
                    <span className="text-sm font-medium leading-none">Type</span>
                    <Select value={type} onValueChange={(v: any) => setType(v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tags">Tag</SelectItem>
                            <SelectItem value="statuses">Status</SelectItem>
                            <SelectItem value="priorities">Priority</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2 w-[120px]">
                    <span className="text-sm font-medium leading-none">Color</span>
                    <Input 
                        placeholder="e.g. red, #ff0000" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)} 
                    />
                </div>
                <Button size="icon" onClick={handleCreate}>
                    <IconPlus className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
