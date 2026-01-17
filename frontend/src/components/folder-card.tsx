import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deleteFolder, useFolders } from "@/hooks/use-folders"
import { toast } from "sonner"

interface Application {
  id: number
  title: string
  role: string
  status: any
  company: string
}

interface FolderCardProps {
  id: number
  title: string
  applications: Application[]
}

export function FolderCard({ id, title, applications }: FolderCardProps) {
  const { mutate } = useFolders()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this folder?")) {
        try {
            await deleteFolder(id)
            toast.success("Folder deleted")
            mutate()
        } catch (error) {
            // Error handled by apiRequest
        }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
            <CardTitle>{title}</CardTitle>
            <CardDescription>Recent applications</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium">{app.title}</TableCell>
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" style={{ backgroundColor: app.status?.color, color: app.status?.color ? 'white' : undefined }}>
                      {app.status?.title || "No Status"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
