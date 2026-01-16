import { appConfig } from "@/config/app";
import { getErrorMessage } from "@/config/errors";
import { toast } from "sonner";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${appConfig.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "An error occurred" }));
      const message = getErrorMessage(error.detail);
      toast.error(message);
      const err = new Error(message);
      (err as any).isShown = true;
      throw err;
    }

    if (res.status === 204) return null;
    return res.json();
  } catch (error: any) {
    if (error.isShown) {
        throw error;
    }
    
    if (!error.message || error.message === "Failed to fetch") {
        toast.error("Network error. Please check your connection.");
        const err = new Error("Network error");
        (err as any).isShown = true;
        throw err;
    }
    
    const message = error.message || "An unexpected error occurred";
    toast.error(message);
    error.isShown = true;
    throw error;
  }
}
