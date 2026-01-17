export const appConfig = {
  environment: process.env.NEXT_PUBLIC_APP_ENV || "dev",
  apiUrl: (typeof window === "undefined" && process.env.INTERNAL_API_URL)
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"),
}
