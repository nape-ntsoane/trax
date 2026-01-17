import { apiRequest } from "@/lib/api";
import useSWR from "swr";

export interface Folder {
  id: number;
  title: string;
  position: number;
  count: number;
}

export interface FolderWithRecentApplications {
    folder: Folder;
    recent_applications: any[];
    application_count: number;
}

export interface DashboardResponse {
    items: FolderWithRecentApplications[];
    total: number;
    page: number;
    per_page: number;
}

export function useFolders() {
  const { data, error, isLoading, mutate } = useSWR<DashboardResponse>("/folders/dashboard", apiRequest);

  return {
    folders: data?.items || [],
    isLoading,
    isError: error,
    mutate,
  };
}

export async function createFolder(title: string) {
    return apiRequest("/folders/", {
        method: "POST",
        body: JSON.stringify({ title }),
    });
}

export async function deleteFolder(id: number) {
    return apiRequest(`/folders/${id}`, {
        method: "DELETE",
    });
}
