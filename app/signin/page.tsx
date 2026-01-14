"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Music2, Sparkles, TrendingUp, Radio } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Brand */}
      <div className="hidden lg:flex flex-col justify-between bg-primary/5 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Music2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Muzi</span>
          </div>
          
          <div className="space-y-6 max-w-md">
            <h1 className="text-5xl font-bold leading-tight">
              Music streaming,<br />
              <span className="text-primary">powered by votes</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Create your stream, share the link, and let your audience decide what plays next.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-8 pt-8 border-t border-border">
          <div>
            <div className="text-3xl font-bold text-primary">2K+</div>
            <div className="text-sm text-muted-foreground">Active Streamers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">50K+</div>
            <div className="text-sm text-muted-foreground">Songs Played</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">100K+</div>
            <div className="text-sm text-muted-foreground">Total Votes</div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Music2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Muzi</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to continue to your dashboard</p>
          </div>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full py-6 text-base font-medium"
            variant="outline"
            size="lg"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-background text-muted-foreground">What you get</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                <Radio className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Your own stream space</div>
                <div className="text-sm text-muted-foreground">Shareable link for your audience</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Real-time voting</div>
                <div className="text-sm text-muted-foreground">Let viewers choose the music</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-medium">Auto-managed queue</div>
                <div className="text-sm text-muted-foreground">Songs play based on votes</div>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
