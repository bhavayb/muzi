"use client"
import { Button } from "@/components/ui/button"
import { Music2 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { signIn, signOut, useSession } from 'next-auth/react'
export function Navbar() {
  const session = useSession();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music2 className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Muzi</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it Works
          </a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </a>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session.data?.user && <Button variant="destructive" size="sm" onClick={() => signOut()}>Sign Out</Button>}
          {!session.data?.user && <Button variant="default" size="sm" onClick={() => signIn()}>Log In</Button>}
          {/* <Button size="sm">Get Started</Button> */}
        </div>
      </div>
    </nav>
  )
}
