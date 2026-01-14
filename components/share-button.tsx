"use client"

import { useState } from "react"
import { Share2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("Vote for the next song on my stream!")}`
    window.open(twitterUrl, "_blank")
  }

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    window.open(facebookUrl, "_blank")
  }

  const handleShareReddit = () => {
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent("Vote for the next song!")}`
    window.open(redditUrl, "_blank")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 px-6 py-6 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
          <Share2 className="h-6 w-6" />
          <span>Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareTwitter} className="cursor-pointer">
          <span>Share on Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareFacebook} className="cursor-pointer">
          <span>Share on Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareReddit} className="cursor-pointer">
          <span>Share on Reddit</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
