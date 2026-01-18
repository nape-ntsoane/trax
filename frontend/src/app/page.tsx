import Link from "next/link";
import { Button } from "@/components/ui/button";
import { brand } from "@/config/brand";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background font-sans">
      <div className="absolute inset-0 z-0 animate-hue-rotate">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_60%)]"></div>
      </div>
      <main className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="flex items-center gap-4 mb-8">
          <img src={brand.logo} alt={`${brand.name} logo`} className="h-16 w-16 rounded-lg border-2 border-white/20 shadow-lg" />
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-foreground animate-text-glow">
            {brand.name}
          </h1>
        </div>
        <p className="max-w-xl text-xl text-muted-foreground mb-10">
          {brand.description}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
