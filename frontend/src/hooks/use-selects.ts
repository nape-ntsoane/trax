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
    const { data } = useSWR<SelectsResponse>("/selects/", apiRequest);

    return {
        statuses: data?.statuses || [],
        priorities: data?.priorities || [],
        tags: data?.tags || [],
    };
}
