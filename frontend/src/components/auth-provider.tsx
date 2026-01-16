"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { appConfig } from "@/config/app"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (appConfig.environment === "dev") return

    const token = localStorage.getItem("token")
    const publicPaths = ["/login", "/register"]

    if (!token && !publicPaths.includes(pathname)) {
      router.push("/login")
    }
  }, [router, pathname])

  return <>{children}</>
}
