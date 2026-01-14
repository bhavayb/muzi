"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function DashboardRedirect() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    async function redirectToUserStream() {
      if (session.status === "loading") return

      if (!session.data?.user?.email) {
        router.push("/")
        return
      }

      try {
        const response = await fetch('/api/streams/my', {
          credentials: 'include',
        })
        const data = await response.json()
        
        if (response.ok && data.streams && data.streams.length > 0) {
          const userId = data.streams[0].userId
          router.push(`/dashboard/${userId}`)
        } else if (response.ok) {
          // User exists but has no streams yet - get user ID from session
          const userResponse = await fetch('/api/user/me', {
            credentials: 'include',
          })
          const userData = await userResponse.json()
          if (userData.userId) {
            router.push(`/dashboard/${userData.userId}`)
          }
        }
      } catch (error) {
        console.error("Error redirecting:", error)
        router.push("/")
      }
    }

    redirectToUserStream()
  }, [session, router])

  return null
}
