"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { brand } from "@/config/brand"
import { auth } from "@/lib/auth"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconAlertTriangle } from "@tabler/icons-react"
import Image from "next/image"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
        toast.error("Passwords do not match")
        return
    }

    setLoading(true)
    try {
      await auth.register(email, password)
      toast.success("Registered successfully. Please login.")
      router.push("/login")
    } catch (error: any) {
      // Error is already toasted in auth.register (via apiRequest)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 z-0 animate-hue-rotate">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_60%)]"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center mb-8">
            <div className="flex items-center gap-4">
                <Image src={brand.logo} alt={`${brand.name} logo`} width={64} height={64} className="rounded-lg border-2 border-white/20 shadow-lg" />
                <h1 className="text-5xl font-bold tracking-tight text-foreground">{brand.name}</h1>
            </div>
            <p className="text-muted-foreground mt-2">{brand.description}</p>
        </div>
        <Card className="w-full max-w-md bg-background/80 backdrop-blur-sm relative z-10">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Create an account to start tracking your applications.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="grid gap-4">
                <Alert variant="destructive">
                    <IconAlertTriangle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                        Please remember your password. There is no "reset password" feature implemented yet.
                    </AlertDescription>
                </Alert>
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input 
                    id="confirm-password" 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full mt-4" disabled={loading}>
                    {loading ? "Signing up..." : "Sign up"}
                </Button>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
          </form>
        </Card>
    </div>
  )
}
