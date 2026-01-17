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
}

export function useApplications(folderId?: number) {
    const endpoint = folderId ? `/folders/${folderId}/applications` : "/applications/";
    const { data, error, isLoading, mutate } = useSWR<Application[]>(endpoint, apiRequest);

    return {
        applications: data,
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
