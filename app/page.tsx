"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "./components/loading-spinner"

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to registration-closed page immediately
    router.replace("/registration-closed")
  }, [router])

  // Show loading spinner while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
