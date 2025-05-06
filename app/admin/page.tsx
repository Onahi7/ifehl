"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Download, Check, X, Eye } from "lucide-react"
import Link from "next/link"
import { fetchRegistrations, approveRegistration } from "../actions"

type Registration = {
  id: number
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  phone: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function AdminPage() {  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      const data = await fetchRegistrations()
      setRegistrations(data)
    } catch (error) {
      console.error("Error loading registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleApprove = async (id: number) => {
    try {
      await approveRegistration(id)
      await loadRegistrations() // Refresh the list
    } catch (error) {
      console.error("Error approving registration:", error)
    }
  }

  const exportToCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Registration Date"]
    const csvData = registrations.map(reg => [
      reg.id,
      `${reg.first_name}${reg.middle_name ? ` ${reg.middle_name}` : ''} ${reg.last_name}`,
      reg.email,
      reg.phone,
      reg.status,
      new Date(reg.created_at).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `registrations-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Registration
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>            <div className="flex items-center gap-4">
              <Link 
                href="/admin/full-details"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                View Full Details
              </Link>
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 border-b">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-purple-900 font-semibold">Total Registrations</h3>
              <p className="text-3xl font-bold text-purple-700">{registrations.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-green-900 font-semibold">Approved</h3>
              <p className="text-3xl font-bold text-green-700">
                {registrations.filter(r => r.status === "approved").length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-yellow-900 font-semibold">Pending</h3>
              <p className="text-3xl font-bold text-yellow-700">
                {registrations.filter(r => r.status === "pending").length}
              </p>
            </div>
          </div>

          {/* Registrations Table */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Full Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Registration Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="text-center p-4">Loading...</td>
                    </tr>
                  ) : registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center p-4">No registrations found</td>
                    </tr>
                  ) : (                    registrations.map((reg) => (
                      <tr key={reg.id} className="border-b hover:bg-gray-50">                        <td className="p-3">{reg.id}</td>
                        <td className="p-3">
                          {reg.first_name} 
                          {reg.middle_name ? `${reg.middle_name} ` : ''}
                          {reg.last_name}
                        </td>
                        <td className="p-3">{reg.email}</td>
                        <td className="p-3">{reg.phone}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            reg.status === "approved" 
                              ? "bg-green-100 text-green-800" 
                              : reg.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-3">
                          {new Date(reg.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleApprove(reg.id)}
                              disabled={reg.status === "approved"}
                              className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                              title="Approve"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => setSelectedRegistration(reg)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
