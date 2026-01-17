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
import { IconPlus, IconSearch, IconFolderPlus, IconChevronDown, IconTrash } from "@tabler/icons-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useApplicationsTable, ApplicationsTable, Application } from "@/components/applications-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateFolderSheet, CreateApplicationSheet } from "@/components/create-forms"
import { toast } from "sonner"
import { useFolders, deleteFolder } from "@/hooks/use-folders"
import { useApplications } from "@/hooks/use-applications"

export default function Page() {
  const [activeTab, setActiveTab] = React.useState("all")
  const [showCreateFolder, setShowCreateFolder] = React.useState(false)
  const [showCreateApp, setShowCreateApp] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [searchQuery, setSearchQuery] = React.useState("")
  
  const { folders, isLoading: foldersLoading, mutate: mutateFolders } = useFolders()
  
  // Fetch applications based on active tab and page
  const folderId = activeTab === "all" ? undefined : parseInt(activeTab)
  const { applications, total, isLoading: appsLoading, mutate: mutateApps } = useApplications(folderId, page)

  // Reset page when tab changes
  React.useEffect(() => {
      setPage(1)
      setSearchQuery("")
  }, [activeTab])

  const filteredApplications = React.useMemo(() => {
      if (!searchQuery) return applications
      const lowerQuery = searchQuery.toLowerCase()
      return applications.filter(app => 
          app.title.toLowerCase().includes(lowerQuery) ||
          app.company.toLowerCase().includes(lowerQuery) ||
          app.role?.toLowerCase().includes(lowerQuery) ||
          app.status?.title.toLowerCase().includes(lowerQuery) ||
          app.priority?.title.toLowerCase().includes(lowerQuery)
      )
  }, [applications, searchQuery])

  const table = useApplicationsTable(filteredApplications, total, page, 25, setPage)

  const handleDeleteFolder = async () => {
      if (activeTab === "all") return
      if (confirm("Are you sure you want to delete this folder?")) {
          try {
              await deleteFolder(parseInt(activeTab))
              toast.success("Folder deleted")
              setActiveTab("all")
              mutateFolders()
              mutateApps()
          } catch (error) {
              // Error handled by apiRequest
          }
      }
  }

  if ((foldersLoading) && !folders) {
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
        <div className="flex flex-1 flex-col p-4 md:p-6 gap-6">
          {/* Auto-create Input */}
          <div className="flex gap-2">
            <Input 
                placeholder="Paste job link or job post text to auto-create application..."
                className="animate-breathing-glow border-purple-400/50 focus-visible:ring-purple-500/50"
            />
            <Button className="animate-breathing-glow bg-background border border-purple-400/50 hover:bg-accent">
                <span className="animate-text-glow font-bold">Auto-Create</span>
            </Button>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col gap-6">
            {/* Tabs Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 overflow-x-auto pb-2">
                <TabsList className="w-max justify-start">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {folders?.map((item) => (
                    item.folder && (
                        <TabsTrigger key={item.folder.id} value={item.folder.id.toString()}>
                        {item.folder.title}
                        </TabsTrigger>
                    )
                  ))}
                </TabsList>
              </div>
              {activeTab !== "all" && (
                <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={handleDeleteFolder}>
                  <IconTrash className="h-4 w-4" />
                  <span className="sr-only">Delete Folder</span>
                </Button>
              )}
            </div>

            {/* Search & Actions Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search applications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <IconChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="flex-1 sm:flex-none" size="icon" onClick={() => setShowCreateFolder(true)}>
                  <IconFolderPlus className="h-4 w-4" />
                  <span className="sr-only">Create Folder</span>
                </Button>
                <Button className="flex-1 sm:flex-none" size="icon" onClick={() => setShowCreateApp(true)}>
                  <IconPlus className="h-4 w-4" />
                  <span className="sr-only">Create Application</span>
                </Button>
              </div>
            </div>

            {/* Table Content */}
            <TabsContent value={activeTab} className="mt-0">
               <ApplicationsTable table={table} />
            </TabsContent>
          </Tabs>
        </div>

        <CreateFolderSheet open={showCreateFolder} onOpenChange={setShowCreateFolder} />
        <CreateApplicationSheet open={showCreateApp} onOpenChange={setShowCreateApp} />
      </SidebarInset>
    </SidebarProvider>
  )
}
