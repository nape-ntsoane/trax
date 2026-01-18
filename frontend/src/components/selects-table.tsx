"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { IconEdit, IconTrash } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export type SelectItem = {
  id: number
  title: string
  color: string
}

interface SelectsTableProps {
  data: SelectItem[]
  title: string
  onDelete: (id: number) => void
  onUpdate: (id: number, data: any) => Promise<void>
}

export function SelectsTable({ data, title, onDelete, onUpdate }: SelectsTableProps) {
  const [editingItem, setEditingItem] = React.useState<SelectItem | null>(null)
  const [editTitle, setEditTitle] = React.useState("")
  const [editColor, setEditColor] = React.useState("")

  const handleEdit = (item: SelectItem) => {
      setEditingItem(item)
      setEditTitle(item.title)
      setEditColor(item.color)
  }

  const handleSave = async () => {
      if (!editingItem) return
      try {
          await onUpdate(editingItem.id, { title: editTitle, color: editColor })
          toast.success("Item updated")
          setEditingItem(null)
      } catch (error) {
          // Error handled by apiRequest
      }
  }

  const columns: ColumnDef<SelectItem>[] = React.useMemo(() => [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: row.getValue("color") }}
          />
          <span className="capitalize">{row.getValue("color")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(row.original)}>
            <IconEdit className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(row.original.id)}
          >
            <IconTrash className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ], [onDelete])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
        pagination: {
            pageSize: 5
        }
    }
  })

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
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
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
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

      <Sheet open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit {title.slice(0, -1)}</SheetTitle>
            <SheetDescription>
              Make changes to your item here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-6 py-8 px-8 sm:px-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input id="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit" onClick={handleSave}>Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
