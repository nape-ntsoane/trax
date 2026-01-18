import { apiRequest } from "@/lib/api";
import useSWR from "swr";

export interface Application {
    id: number;
    title: string;
    company: string;
    status: any;
    priority: any;
    closing_date: string;
    link: string;
    salary: string;
    role: string;
    folder_id: number;
    starred: boolean;
}

export interface ApplicationsResponse {
    items: Application[];
    total: number;
    page: number;
    per_page: number;
}

export function useApplications(folderId?: number, page: number = 1, perPage: number = 25, sortBy: string = "updated_at", sortOrder: "asc" | "desc" = "desc") {
    const baseUrl = folderId ? `/folders/${folderId}/applications` : "/applications/";
    const endpoint = `${baseUrl}?page=${page}&per_page=${perPage}&sort_by=${sortBy}&sort_order=${sortOrder}`;
    
    const { data, error, isLoading, mutate } = useSWR<ApplicationsResponse>(endpoint, apiRequest);

    return {
        applications: data?.items || [],
        total: data?.total || 0,
        page: data?.page || 1,
        per_page: data?.per_page || perPage,
        isLoading,
        isError: error,
        mutate,
    };
}

export async function createApplication(data: any) {
    return apiRequest("/applications/", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateApplication(id: number, data: any) {
    return apiRequest(`/applications/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteApplication(id: number) {
    return apiRequest(`/applications/${id}`, {
        method: "DELETE",
    });
}
