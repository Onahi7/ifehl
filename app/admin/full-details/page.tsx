"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Eye, Mail, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { 
  fetchRegistrations, 
  fetchRegistrationDetails, 
  checkEmailSent 
} from "../../actions"
import { sendApprovalEmail, sendReminderEmail } from "@/app/email-service"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ExportButton from "@/app/components/export-button"
import { toast } from "@/components/ui/use-toast"

type Registration = {
  id: number
  first_name: string
  middle_name?: string
  last_name: string
  email: string
  phone: string
  alt_phone?: string
  gender: string
  dob: string
  marital_status?: string
  city?: string
  address?: string
  institute?: string
  professional_status?: string
  workplace?: string
  attended?: boolean
  expectations?: string
  hear_about?: string
  status: "pending" | "approved" | "rejected"
  payment_status: "paid" | "unpaid"
  payment_reference?: string
  payment_date?: string
  created_at: string
  // Add email tracking info
  approvalEmailSent?: boolean
  reminderEmailSent?: boolean
}

export default function FullDetailsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")

  useEffect(() => {
    loadRegistrations()
  }, [])

  const loadRegistrations = async () => {
    try {
      setIsLoading(true)
      // First fetch basic registration data
      const basicData = await fetchRegistrations()
      
      // For each registration, fetch full details
      const detailedRegistrations = await Promise.all(
        basicData.map(async (reg: any) => {
          const details = await fetchRegistrationDetails(reg.id)
          
          // Check if emails have been sent for this registration
          const approvalEmail = await checkEmailSent(reg.id, 'approval')
          const reminderEmail = await checkEmailSent(reg.id, 'reminder')
          
          return {
            ...details,
            approvalEmailSent: !!approvalEmail,
            reminderEmailSent: !!reminderEmail
          } as Registration
        })
      )
      
      setRegistrations(detailedRegistrations)
    } catch (error) {
      console.error("Error loading registrations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRegistrations = () => {
    if (selectedTab === "all") return registrations
    if (selectedTab === "approved") return registrations.filter(r => r.status === "approved")
    if (selectedTab === "pending") return registrations.filter(r => r.status === "pending")
    if (selectedTab === "paid") return registrations.filter(r => r.payment_status === "paid")
    if (selectedTab === "unpaid") return registrations.filter(r => r.payment_status === "unpaid")
    return registrations
  }

  const handleSendApprovalEmail = async (registration: Registration) => {
    try {
      const result = await sendApprovalEmail(
        registration.email,
        registration.first_name,
        registration.id.toString()
      )
      
      if (result.success) {
        // Update local state to reflect that email was sent
        setRegistrations(prevRegistrations => 
          prevRegistrations.map(reg => 
            reg.id === registration.id 
              ? { ...reg, approvalEmailSent: true } 
              : reg
          )
        )
        
        toast({
          title: "Email Sent",
          description: `Approval email sent to ${registration.email}`,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send approval email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending approval email:", error)
      toast({
        title: "Error",
        description: "Failed to send approval email",
        variant: "destructive",
      })
    }
  }

  const handleSendReminderEmail = async (registration: Registration) => {
    try {
      const result = await sendReminderEmail(
        registration.email,
        registration.first_name,
        registration.id.toString()
      )
      
      if (result.success) {
        // Update local state to reflect that email was sent
        setRegistrations(prevRegistrations => 
          prevRegistrations.map(reg => 
            reg.id === registration.id 
              ? { ...reg, reminderEmailSent: true } 
              : reg
          )
        )
        
        toast({
          title: "Email Sent",
          description: `Reminder email sent to ${registration.email}`,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send reminder email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending reminder email:", error)
      toast({
        title: "Error",
        description: "Failed to send reminder email",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Full Registration Details</h1>
            </div>
            <ExportButton 
              data={filteredRegistrations()} 
              filename="cmda-detailed-registrations" 
              className="bg-green-600 text-white hover:bg-green-700"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs for filtering */}
          <div className="p-4 border-b">
            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-5 w-full max-w-xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Data display */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em]"></div>
                <p className="mt-4 text-gray-600">Loading detailed registration data...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-600">No registration data found</p>
              </div>
            ) : (
              <div style={{ height: "70vh", overflow: "hidden" }}>
                <div className="h-full overflow-y-auto">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold bg-white">ID</th>
                          <th className="text-left p-3 font-semibold bg-white">Full Name</th>
                          <th className="text-left p-3 font-semibold bg-white">Email</th>
                          <th className="text-left p-3 font-semibold bg-white">Phone</th>
                          <th className="text-left p-3 font-semibold bg-white">Alt Phone</th>
                          <th className="text-left p-3 font-semibold bg-white">Gender</th>
                          <th className="text-left p-3 font-semibold bg-white">DOB</th>
                          <th className="text-left p-3 font-semibold bg-white">Marital Status</th>
                          <th className="text-left p-3 font-semibold bg-white">City</th>
                          <th className="text-left p-3 font-semibold bg-white">Address</th>
                          <th className="text-left p-3 font-semibold bg-white">Institute</th>
                          <th className="text-left p-3 font-semibold bg-white">Professional Status</th>
                          <th className="text-left p-3 font-semibold bg-white">Workplace</th>
                          <th className="text-left p-3 font-semibold bg-white">Attended Before</th>
                          <th className="text-left p-3 font-semibold bg-white">Expectations</th>
                          <th className="text-left p-3 font-semibold bg-white">Heard About</th>
                          <th className="text-left p-3 font-semibold bg-white">Status</th>
                          <th className="text-left p-3 font-semibold bg-white">Payment Status</th>
                          <th className="text-left p-3 font-semibold bg-white">Registration Date</th>
                          <th className="text-left p-3 font-semibold bg-white">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegistrations().map((reg) => (
                          <tr key={reg.id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{reg.id}</td>
                            <td className="p-3 whitespace-nowrap">
                              {reg.first_name} 
                              {reg.middle_name ? ` ${reg.middle_name} ` : ' '}
                              {reg.last_name}
                            </td>
                            <td className="p-3">{reg.email}</td>
                            <td className="p-3">{reg.phone}</td>
                            <td className="p-3">{reg.alt_phone || "-"}</td>
                            <td className="p-3">{reg.gender}</td>
                            <td className="p-3">{new Date(reg.dob).toLocaleDateString()}</td>
                            <td className="p-3">{reg.marital_status || "-"}</td>
                            <td className="p-3">{reg.city || "-"}</td>
                            <td className="p-3 whitespace-normal max-w-xs">
                              <div className="max-h-20 overflow-y-auto">{reg.address || "-"}</div>
                            </td>
                            <td className="p-3">{reg.institute || "-"}</td>
                            <td className="p-3">{reg.professional_status || "-"}</td>
                            <td className="p-3">{reg.workplace || "-"}</td>
                            <td className="p-3">{reg.attended ? "Yes" : "No"}</td>
                            <td className="p-3 whitespace-normal max-w-xs">
                              <div className="max-h-20 overflow-y-auto">{reg.expectations || "-"}</div>
                            </td>
                            <td className="p-3">{reg.hear_about || "-"}</td>
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
                              <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                                reg.payment_status === "paid" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {reg.payment_status.charAt(0).toUpperCase() + reg.payment_status.slice(1)}
                              </span>
                            </td>
                            <td className="p-3">{new Date(reg.created_at).toLocaleDateString()}</td>
                            <td className="p-3">
                              <Link 
                                href={`/admin?view=${reg.id}`}
                                className="p-1 text-blue-600 hover:text-blue-800 inline-flex items-center"
                                title="View Details"
                              >
                                <Eye className="h-5 w-5 mr-1" />
                                Details
                              </Link>
                            </td>
                            <td className="p-3">                              <div className="flex items-center space-x-2">
                                <Button
                                  variant={
                                    (reg.status === "approved" && reg.approvalEmailSent) ||
                                    (reg.status !== "approved" && reg.reminderEmailSent)
                                      ? "outline"
                                      : "ghost"
                                  }
                                  size="sm"
                                  className={`${
                                    reg.status === "approved" 
                                      ? (reg.approvalEmailSent 
                                          ? "text-green-600 border-green-600" 
                                          : "text-green-600 hover:text-green-700")
                                      : (reg.reminderEmailSent 
                                          ? "text-yellow-600 border-yellow-600" 
                                          : "text-yellow-600 hover:text-yellow-700")
                                  }`}
                                  onClick={() => 
                                    reg.status === "approved" 
                                      ? handleSendApprovalEmail(reg)
                                      : handleSendReminderEmail(reg)
                                  }
                                >
                                  {(reg.status === "approved" && reg.approvalEmailSent) || 
                                   (reg.status !== "approved" && reg.reminderEmailSent) 
                                    ? <CheckCircle className="h-4 w-4 mr-1" /> 
                                    : <Mail className="h-4 w-4 mr-1" />
                                  }
                                  {reg.status === "approved" 
                                    ? (reg.approvalEmailSent ? "Approval Sent" : "Send Approval")
                                    : (reg.reminderEmailSent ? "Reminder Sent" : "Send Reminder")
                                  }
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
