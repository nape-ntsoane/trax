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

export function CreateFolderSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
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
            <Input id="name" placeholder="e.g. Frontend Roles" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={() => {
              onOpenChange(false)
              toast.success("Folder created")
          }}>Create Folder</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export function CreateApplicationSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
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
            <Input id="title" placeholder="e.g. Senior Engineer" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" placeholder="e.g. Acme Corp" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" placeholder="e.g. Frontend" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Not Applied">Not Applied</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" placeholder="e.g. $120k" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="closing_date">Closing Date</Label>
            <Input id="closing_date" type="date" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">Link</Label>
            <Input id="link" placeholder="https://..." />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit" onClick={() => {
              onOpenChange(false)
              toast.success("Application created")
          }}>Create Application</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
