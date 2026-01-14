"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

export function Redirect(){
    const session = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const [hasRedirected, setHasRedirected] = useState(false)

    useEffect(() => {
        async function redirectUser() {
            if (hasRedirected) return
            
            // Only redirect from homepage
            if (pathname !== "/") return

            if(session?.data?.user){
                setHasRedirected(true)
                try {
                    const response = await fetch('/api/streams/my', {
                        credentials: 'include',
                    })
                    const data = await response.json()
                    
                    if (response.ok && data.streams && data.streams.length > 0) {
                        const userId = data.streams[0].userId
                        router.push(`/dashboard/${userId}`)
                    } else if (response.ok) {
                        // User has no streams yet - get user ID from session
                        const userResponse = await fetch('/api/user/me', {
                            credentials: 'include',
                        })
                        const userData = await userResponse.json()
                        if (userData.userId) {
                            router.push(`/dashboard/${userData.userId}`)
                        }
                    }
                } catch (error) {
                    console.error("Error:", error)
                }
            } else if (session.status === "unauthenticated") {
                // Already on homepage, no need to redirect
                setHasRedirected(true)
            }
        }

        redirectUser()
    }, [session, router, hasRedirected, pathname])

    return null
}