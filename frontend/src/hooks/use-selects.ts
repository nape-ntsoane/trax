import { apiRequest } from "@/lib/api";
import useSWR from "swr";

export interface SelectOption {
    id: number;
    title: string;
    color: string;
}

export interface SelectsResponse {
    tags: SelectOption[];
    statuses: SelectOption[];
    priorities: SelectOption[];
}

export function useSelects() {
    const { data, mutate } = useSWR<SelectsResponse>("/selects/", apiRequest);

    return {
        statuses: data?.statuses || [],
        priorities: data?.priorities || [],
        tags: data?.tags || [],
        mutate
    };
}

export async function createSelect(type: "tags" | "statuses" | "priorities", data: any) {
    return apiRequest(`/selects/${type}`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateSelect(type: "tags" | "statuses" | "priorities", id: number, data: any) {
    return apiRequest(`/selects/${type}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export async function deleteSelect(type: "tags" | "statuses" | "priorities", id: number) {
    return apiRequest(`/selects/${type}/${id}`, {
        method: "DELETE",
    });
}
