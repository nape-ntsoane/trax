"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as ReactTable,
} from "@tanstack/react-table"
import {
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export type Application = {
  id: number
  title: string
  company: string
  role: string
  status: string
  priority: string
  salary: string
  closing_date: string | null
  link: string | null
  starred: boolean
  folder_id: number
}

function ActionCell({ application }: { application: Application }) {
  const [showEditSheet, setShowEditSheet] = React.useState(false)

  const handleCopyId = () => {
    navigator.clipboard.writeText(application.id.toString())
    toast.success("ID copied to clipboard")
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowEditSheet(true)}>
          <IconEdit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={handleCopyId}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            {application.link && (
              <DropdownMenuItem asChild>
                <a href={application.link} target="_blank" rel="noreferrer">
                  Open Link <IconExternalLink className="ml-2 h-3 w-3" />
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="overflow-y-auto p-6">
          <SheetHeader>
            <SheetTitle>Edit Application</SheetTitle>
            <SheetDescription>
              Make changes to your application here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" defaultValue={application.title} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue={application.company} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={application.role} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={application.status}>
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
                <Select defaultValue={application.priority}>
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
              <Input id="salary" defaultValue={application.salary} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="closing_date">Closing Date</Label>
              <Input 
                id="closing_date" 
                type="date" 
                defaultValue={application.closing_date || ""} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="link">Link</Label>
              <Input id="link" defaultValue={application.link || ""} />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" onClick={() => {
                setShowEditSheet(false)
                toast.success("Application updated")
            }}>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const columns: ColumnDef<Application>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      if (status === "Offer") variant = "default"
      if (status === "Rejected") variant = "destructive"
      if (status === "Interviewing") variant = "secondary"
      
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return <Badge variant="outline">{priority}</Badge>
    },
  },
  {
    accessorKey: "salary",
    header: "Salary",
  },
  {
    accessorKey: "closing_date",
    header: "Closing Date",
    cell: ({ row }) => {
      const date = row.getValue("closing_date") as string | null
      return date ? <div>{date}</div> : <div className="text-muted-foreground">-</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionCell application={row.original} />,
  },
]

export function useApplicationsTable(data: Application[]) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
        pagination: {
            pageSize: 25
        }
    }
  })

  return table
}

interface ApplicationsTableProps {
  table: ReactTable<Application>
}

function getColumnClassName(columnId: string) {
  switch (columnId) {
    case "company":
      return "hidden sm:table-cell"
    case "role":
      return "hidden md:table-cell"
    case "priority":
      return "hidden lg:table-cell"
    case "salary":
      return "hidden xl:table-cell"
    case "closing_date":
      return "hidden xl:table-cell"
    default:
      return ""
  }
}

export function ApplicationsTable({ table }: ApplicationsTableProps) {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className={getColumnClassName(header.id)}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={getColumnClassName(cell.column.id)}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
