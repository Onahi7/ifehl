"use client"

import { useEffect, useState, use, type FormEvent, type ChangeEvent } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Calendar, MapPin, Phone, Mail, Lock } from "lucide-react"
import { fetchCampaignBySlug, submitCampaignRegistration, type Campaign } from "@/app/campaigns/actions"

type FormData = {
  firstName: string
  middleName: string
  lastName: string
  email: string
  phone: string
  altPhone: string
  gender: string
  dob: string
  maritalStatus: string
  city: string
  address: string
  institute: string
  professionalStatus: string
  workplace: string
  attended: string
  expectations: string
  hearAbout: string
}

type FormErrors = {
  [key in keyof FormData]?: string
}

export default function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; registrationId?: number } | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    altPhone: "",
    gender: "",
    dob: "",
    maritalStatus: "",
    city: "",
    address: "",
    institute: "",
    professionalStatus: "",
    workplace: "",
    attended: "",
    expectations: "",
    hearAbout: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ [key in keyof FormData]?: boolean }>({})

  useEffect(() => {
    loadCampaign()
  }, [resolvedParams.slug])

  const loadCampaign = async () => {
    try {
      setIsLoading(true)
      const data = await fetchCampaignBySlug(resolvedParams.slug)
      setCampaign(data)
    } catch (error) {
      console.error("Error loading campaign:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateField = (name: keyof FormData, value: string) => {
    let error = ""
    switch (name) {
      case "firstName":
        if (!value.trim()) error = "First name is required"
        break
      case "lastName":
        if (!value.trim()) error = "Last name is required"
        break
      case "email":
        if (!value.trim()) error = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid"
        break
      case "phone":
        if (!value.trim()) error = "Phone number is required"
        else if (!/^\d{10,15}$/.test(value.replace(/[^0-9]/g, ""))) error = "Please enter a valid phone number"
        break
      case "gender":
        if (!value) error = "Please select your gender"
        break
      case "dob":
        if (!value) error = "Date of birth is required"
        break
    }
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
      return false
    }
    return true
  }

  const validateForm = () => {
    let isValid = true
    const requiredFields: (keyof FormData)[] = ["firstName", "lastName", "email", "phone", "gender", "dob"]
    requiredFields.forEach((field) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      if (!validateField(field, formData[field])) isValid = false
    })
    return isValid
  }

  const resetForm = () => {
    setFormData({
      firstName: "", middleName: "", lastName: "", email: "", phone: "", altPhone: "",
      gender: "", dob: "", maritalStatus: "", city: "", address: "", institute: "",
      professionalStatus: "", workplace: "", attended: "", expectations: "", hearAbout: "",
    })
    setTouched({})
    setErrors({})
    setSubmitResult(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!campaign || !validateForm()) return

    try {
      setIsSubmitting(true)
      setSubmitResult(null)
      
      const result = await submitCampaignRegistration(campaign.id, formData)
      setSubmitResult(result)

      if (result.success && result.registrationId) {
        setShowSuccess(true)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitResult({ success: false, message: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="text-purple-600 hover:text-purple-700">
            Go to Homepage
          </Link>
        </div>
      </div>
    )
  }

  if (campaign.status !== 'published') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Campaign Not Available</h1>
          <p className="text-gray-600 mb-6">This campaign is not currently active.</p>
        </div>
      </div>
    )
  }

  if (showSuccess && submitResult?.registrationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Registration Successful!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for registering for <strong>{campaign.title}</strong>
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">Your Registration ID</p>
            <p className="text-2xl font-bold text-purple-600">{submitResult.registrationId}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          
          {campaign.payment_account_name && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-yellow-800 mb-2">Payment Information</h3>
              <p className="text-sm text-yellow-700">
                Please complete your payment of <strong>₦{Number(campaign.registration_fee).toLocaleString()}</strong>
              </p>
              <div className="mt-2 text-sm text-yellow-700">
                <p><strong>Account:</strong> {campaign.payment_account_name}</p>
                <p><strong>Number:</strong> {campaign.payment_account_number}</p>
                <p><strong>Bank:</strong> {campaign.payment_bank}</p>
              </div>
              {campaign.payment_instructions && (
                <p className="mt-2 text-sm text-yellow-800 font-medium">{campaign.payment_instructions}</p>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setShowSuccess(false)
              resetForm()
            }}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Register Another Person
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span>Submitting registration...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          {campaign.logo_image_url ? (
            <img 
              src={campaign.logo_image_url} 
              alt={campaign.title} 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain" 
            />
          ) : (
            <h1 className="text-2xl font-bold text-purple-800">{campaign.title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {campaign.social_facebook && (
            <Link href={campaign.social_facebook} className="p-2 hover:text-purple-700">
              <Facebook size={20} />
            </Link>
          )}
          {campaign.social_twitter && (
            <Link href={campaign.social_twitter} className="p-2 hover:text-purple-700">
              <Twitter size={20} />
            </Link>
          )}
          {campaign.social_instagram && (
            <Link href={campaign.social_instagram} className="p-2 hover:text-purple-700">
              <Instagram size={20} />
            </Link>
          )}
          {campaign.social_youtube && (
            <Link href={campaign.social_youtube} className="p-2 hover:text-purple-700">
              <Youtube size={20} />
            </Link>
          )}
        </div>
      </header>

      {/* Banner */}
      <div 
        className="bg-gradient-to-r from-gray-500 via-purple-800 to-green-800 text-white py-10 text-center"
        style={campaign.banner_image_url ? { 
          backgroundImage: `url(${campaign.banner_image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <h2 className="text-3xl font-bold">{campaign.title}</h2>
        {campaign.subtitle && <p className="text-lg mt-2 opacity-90">{campaign.subtitle}</p>}
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Registration Closed Banner */}
        {!campaign.is_registration_open && (
          <div className="bg-red-600 text-white p-8 rounded-lg mb-8 text-center shadow-lg">
            <Lock className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Registration Closed</h2>
            <p className="text-xl">Registration for this event has closed.</p>
            {campaign.contact_phone && (
              <p className="text-sm mt-4">For inquiries, contact: <strong>{campaign.contact_phone}</strong></p>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Event Information</h2>

            {campaign.description && (
              <p className="text-gray-600 mb-6">{campaign.description}</p>
            )}

            {campaign.is_registration_open && campaign.registration_deadline && (
              <div className="bg-orange-500 text-white text-center py-4 mb-6 rounded-lg">
                <p className="font-bold">
                  Registration Deadline: {new Date(campaign.registration_deadline).toLocaleDateString('en-US', { 
                    month: 'long', day: 'numeric', year: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Event Details & Registration */}
          <div>
            <div className="bg-gray-50 p-6 rounded-md mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Event Details</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Calendar className="text-purple-800" size={24} />
                  <div>
                    <span className="font-bold">Date:</span>{' '}
                    {new Date(campaign.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    {' - '}
                    {new Date(campaign.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-purple-800 text-2xl font-bold">₦</span>
                  <div>
                    <span className="font-bold">Registration:</span> ₦{Number(campaign.registration_fee).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="text-purple-800" size={24} />
                  <div>
                    <span className="font-bold">Venue:</span> {campaign.location}
                  </div>
                </div>

                {campaign.contact_phone && (
                  <div className="flex items-center gap-4">
                    <Phone className="text-purple-800" size={24} />
                    <div>
                      <span className="font-bold">Contact:</span> {campaign.contact_phone}
                    </div>
                  </div>
                )}

                {campaign.contact_email && (
                  <div className="flex items-center gap-4">
                    <Mail className="text-purple-800" size={24} />
                    <div>
                      <span className="font-bold">Email:</span> {campaign.contact_email}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            {campaign.payment_account_name && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  <strong>Important:</strong> Please complete your registration by making a payment 
                  of ₦{Number(campaign.registration_fee).toLocaleString()} to validate your submission.
                </p>
                <p className="text-sm text-yellow-700 mb-4">
                  <strong>Account Details:</strong><br />
                  Account Name: {campaign.payment_account_name}<br />
                  Account Number: {campaign.payment_account_number}<br />
                  Bank: {campaign.payment_bank}
                </p>
                {campaign.payment_instructions && (
                  <div className="bg-red-50 border border-red-300 rounded-md p-4 mt-4">
                    <p className="text-sm text-red-700 font-medium">
                      <strong>Transfer Instruction:</strong> {campaign.payment_instructions}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Registration Form */}
            {campaign.is_registration_open ? (
              <div className="border border-gray-300 rounded-md p-6">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Register Here</h3>

                {submitResult && !submitResult.success && (
                  <div className="mb-6 p-4 rounded-md bg-red-100 text-red-800">
                    <p className="font-medium">{submitResult.message}</p>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter Your First Name"
                        className={`w-full p-2 border rounded-md ${touched.firstName && errors.firstName ? "border-red-500" : ""}`}
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                      {touched.firstName && errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="middleName" className="block mb-2">Middle Name</label>
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        placeholder="Enter Your Middle Name"
                        className="w-full p-2 border rounded-md"
                        value={formData.middleName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter Your Last Name"
                      className={`w-full p-2 border rounded-md ${touched.lastName && errors.lastName ? "border-red-500" : ""}`}
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                    {touched.lastName && errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      className={`w-full p-2 border rounded-md ${touched.email && errors.email ? "border-red-500" : ""}`}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    {touched.email && errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Mobile Number"
                        className={`w-full p-2 border rounded-md ${touched.phone && errors.phone ? "border-red-500" : ""}`}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="altPhone" className="block mb-2">Alternate Phone</label>
                      <input
                        type="tel"
                        id="altPhone"
                        name="altPhone"
                        placeholder="Mobile Number"
                        className="w-full p-2 border rounded-md"
                        value={formData.altPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={() => handleRadioChange("gender", "male")}
                          required
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={() => handleRadioChange("gender", "female")}
                        />
                        Female
                      </label>
                    </div>
                    {touched.gender && errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="dob" className="block mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      className={`w-full p-2 border rounded-md ${touched.dob && errors.dob ? "border-red-500" : ""}`}
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                    {touched.dob && errors.dob && (
                      <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="maritalStatus" className="block mb-2">Marital Status</label>
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      className="w-full p-2 border rounded-md"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block mb-2">City Of Residence</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter your city"
                      className="w-full p-2 border rounded-md"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block mb-2">Contact Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      className="w-full p-2 border rounded-md"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="institute" className="block mb-2">Institution of Undergraduate Training</label>
                    <input
                      type="text"
                      id="institute"
                      name="institute"
                      placeholder="Enter your institution"
                      className="w-full p-2 border rounded-md"
                      value={formData.institute}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="professionalStatus" className="block mb-2">Professional Status/Cadre</label>
                    <select
                      id="professionalStatus"
                      name="professionalStatus"
                      className="w-full p-2 border rounded-md"
                      value={formData.professionalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="preHouseOfficer">Pre House Officer</option>
                      <option value="houseOfficer">House Officer</option>
                      <option value="Pre Nysc">Pre Nysc</option>
                      <option value="nysc">Nysc</option>
                      <option value="medicalOfficer">Medical Officer</option>
                      <option value="residentDoctor">Resident Doctor</option>
                      <option value="consultant">Consultant</option>
                      <option value="medicalStudent">Medical Student</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="workplace" className="block mb-2">Current Workplace</label>
                    <input
                      type="text"
                      id="workplace"
                      name="workplace"
                      placeholder="Enter your workplace"
                      className="w-full p-2 border rounded-md"
                      value={formData.workplace}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-2">Have you attended this program before?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="attended"
                          value="yes"
                          checked={formData.attended === "yes"}
                          onChange={() => handleRadioChange("attended", "yes")}
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="attended"
                          value="no"
                          checked={formData.attended === "no"}
                          onChange={() => handleRadioChange("attended", "no")}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="expectations" className="block mb-2">What are your expectations?</label>
                    <textarea
                      id="expectations"
                      name="expectations"
                      rows={3}
                      placeholder="Enter your expectations"
                      className="w-full p-2 border rounded-md"
                      value={formData.expectations}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="hearAbout" className="block mb-2">How did you hear about this program?</label>
                    <input
                      type="text"
                      id="hearAbout"
                      name="hearAbout"
                      placeholder="e.g., Social media, Friend"
                      className="w-full p-2 border rounded-md"
                      value={formData.hearAbout}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "SUBMIT FORM"}
                    </button>
                    <button
                      type="button"
                      className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-md hover:bg-gray-300"
                      onClick={resetForm}
                    >
                      RESET
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="border border-gray-300 rounded-md p-8 text-center bg-gray-50">
                <Lock className="h-16 w-16 mx-auto mb-4 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Registration Closed</h3>
                <p className="text-gray-600">Registration is currently closed for this event.</p>
                {campaign.contact_phone && (
                  <p className="text-sm text-gray-500 mt-4">
                    For more information, contact: <strong>{campaign.contact_phone}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-gray-100 text-center text-gray-600">
        <p>© {new Date().getFullYear()} CMDA Nigeria. All rights reserved.</p>
      </footer>
    </div>
  )
}
