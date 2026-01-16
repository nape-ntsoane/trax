import { apiRequest } from "./api";
import { appConfig } from "@/config/app";
import { endpoints } from "@/config/endpoints";

export const auth = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const res = await fetch(`${appConfig.apiUrl}${endpoints.auth.login}`, {
        method: "POST",
        body: formData,
    } as RequestInit);
    
    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: "Login failed" }));
        throw new Error(error.detail || "Login failed");
    }
    
    const data = await res.json();
    if (typeof window !== "undefined") {
        localStorage.setItem("token", data.access_token);
    }
    return data;
  },
  register: async (email: string, password: string) => {
    return apiRequest(endpoints.auth.register, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        try {
            await apiRequest(endpoints.auth.logout, {
                method: "POST",
            });
        } catch (e) {
            console.error("Logout failed", e);
        }
        localStorage.removeItem("token");
    }
  }
};
