import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useState } from "react"
import { createFolder, useFolders } from "@/hooks/use-folders"
import { createApplication } from "@/hooks/use-applications"
import { useSelects } from "@/hooks/use-selects"

export function CreateFolderSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [title, setTitle] = useState("")
  const { mutate } = useFolders()

  const handleSubmit = async () => {
    try {
      await createFolder(title)
      toast.success("Folder created")
      mutate()
      onOpenChange(false)
      setTitle("")
    } catch (error) {
      // Error handled by apiRequest
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>Create Folder</SheetTitle>
          <SheetDescription>
            Create a new folder to organize your applications.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Frontend Roles" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>Create Folder</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function CreateApplicationSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { statuses, priorities } = useSelects()
  const { folders, mutate } = useFolders()
  
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    role: "",
    status_id: "",
    priority_id: "",
    salary: "",
    closing_date: "",
    link: "",
    folder_id: ""
  })

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        status_id: formData.status_id ? parseInt(formData.status_id) : null,
        priority_id: formData.priority_id ? parseInt(formData.priority_id) : null,
        folder_id: formData.folder_id ? parseInt(formData.folder_id) : null,
        closing_date: formData.closing_date ? new Date(formData.closing_date).toISOString() : null
      }
      
      await createApplication(payload)
      toast.success("Application created")
      mutate() // Refresh folders to update counts/recent apps
      onOpenChange(false)
      setFormData({
        title: "",
        company: "",
        role: "",
        status_id: "",
        priority_id: "",
        salary: "",
        closing_date: "",
        link: "",
        folder_id: ""
      })
    } catch (error) {
       // Error handled by apiRequest
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto p-6">
        <SheetHeader>
          <SheetTitle>Create Application</SheetTitle>
          <SheetDescription>
            Add a new job application to your tracker.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="e.g. Senior Engineer" 
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input 
              id="company" 
              placeholder="e.g. Acme Corp" 
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input 
              id="role" 
              placeholder="e.g. Frontend" 
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="folder">Folder</Label>
            <Select onValueChange={(val) => handleChange("folder_id", val)}>
                <SelectTrigger id="folder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders?.map((f) => (
                      <SelectItem key={f.folder.id} value={f.folder.id.toString()}>
                          {f.folder.title}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(val) => handleChange("status_id", val)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>{s.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(val) => handleChange("priority_id", val)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                   {priorities.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input 
              id="salary" 
              placeholder="e.g. $120k" 
              value={formData.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="closing_date">Closing Date</Label>
            <Input 
              id="closing_date" 
              type="date" 
              value={formData.closing_date}
              onChange={(e) => handleChange("closing_date", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">Link</Label>
            <Input 
              id="link" 
              placeholder="https://..." 
              value={formData.link}
              onChange={(e) => handleChange("link", e.target.value)}
            />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={handleSubmit}>Create Application</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
