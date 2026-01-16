export const appConfig = {
  environment: process.env.NEXT_PUBLIC_APP_ENV || "dev",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
}
