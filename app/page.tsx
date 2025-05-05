"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Calendar, DollarSign, MapPin, Phone } from "lucide-react"
import { submitRegistration } from "./actions"
import LoadingSpinner from "@/app/components/loading-spinner"
import SuccessPage from "@/app/components/success-page"

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

type SubmitResult = {
  success: boolean
  message: string
  registrationId?: number
}

export default function Home() {  const [formData, setFormData] = useState<FormData>({
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null)
  const [showSuccessPage, setShowSuccessPage] = useState(false)
  const [registrationId, setRegistrationId] = useState<number | undefined>(undefined)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Clear error when user types
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Clear error when user selects
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleBlur = (name: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
    validateField(name, formData[name])
  }

  const validateField = (name: keyof FormData, value: string) => {
    let error = ""

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required"
        }
        break
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required"
        }
        break
      case "email":
        if (!value.trim()) {
          error = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email is invalid"
        }
        break
      case "phone":
        if (!value.trim()) {
          error = "Phone number is required"
        } else if (!/^\d{10,15}$/.test(value.replace(/[^0-9]/g, ""))) {
          error = "Please enter a valid phone number"
        }
        break
      case "gender":
        if (!value) {
          error = "Please select your gender"
        }
        break
      case "dob":
        if (!value) {
          error = "Date of birth is required"
        }
        break
      default:
        break
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
      return false
    }
    return true
  }

  const validateForm = () => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Mark all required fields as touched
    const newTouched = { ...touched }
    ;["firstName", "lastName", "email", "phone", "gender", "dob"].forEach((field) => {
      newTouched[field as keyof FormData] = true
    })
    setTouched(newTouched)

    // Validate each required field
    if (!validateField("firstName", formData.firstName)) isValid = false
    if (!validateField("lastName", formData.lastName)) isValid = false
    if (!validateField("email", formData.email)) isValid = false
    if (!validateField("phone", formData.phone)) isValid = false
    if (!validateField("gender", formData.gender)) isValid = false
    if (!validateField("dob", formData.dob)) isValid = false

    setErrors(newErrors)
    return isValid
  }
  const resetForm = () => {
    setFormData({
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
    setTouched({})
    setErrors({})
    setSubmitResult(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        setIsSubmitting(true)
        setSubmitResult(null)

        // Submit form data to server action
        const result = await submitRegistration(formData)
        
        // Ensure we have a valid result object
        const safeResult = {
          success: Boolean(result?.success),
          message: String(result?.message || "Registration processed"),
          registrationId: result?.registrationId ? Number(result.registrationId) : undefined
        }

        setSubmitResult(safeResult)

        if (safeResult.success && safeResult.registrationId) {
          // Store registration ID and show success page
          setRegistrationId(safeResult.registrationId)
          setShowSuccessPage(true)
          
          // No need to reset form here as we'll show success page
          // Form will reset when returning from success page
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        setSubmitResult({
          success: false,
          message: "An unexpected error occurred. Please try again.",
        })
      } finally {
        setIsSubmitting(false)
      }
    } else {
      console.log("Form has errors")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Loading Spinner */}
      {isSubmitting && <LoadingSpinner />}      {/* Success Page */}
      {showSuccessPage && registrationId && (
        <SuccessPage 
          registrationId={registrationId}
          participantName={`${formData.firstName}${formData.middleName ? ` ${formData.middleName}` : ''} ${formData.lastName}`}
          email={formData.email}
          onClose={() => {
            setShowSuccessPage(false)
            resetForm()
          }}
        />
      )}

      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <img 
            src="https://res.cloudinary.com/da5amwknx/image/upload/v1745159759/cm_metgxv.png" 
            alt="CMDA Logo" 
            className="h-16 sm:h-20 md:h-24 w-auto object-contain" 
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href="https://facebook.com" className="p-2 hover:text-purple-700">
            <Facebook size={20} />
          </Link>
          <Link href="https://twitter.com" className="p-2 hover:text-purple-700">
            <Twitter size={20} />
          </Link>
          <Link href="https://instagram.com" className="p-2 hover:text-purple-700">
            <Instagram size={20} />
          </Link>
          <Link href="https://youtube.com" className="p-2 hover:text-purple-700">
            <Youtube size={20} />
          </Link>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-r from-gray-500 via-purple-800 to-green-800 text-white py-10 text-center">
        <h2 className="text-3xl font-bold">IFEHL 2025 (02)</h2>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Registration Information</h2>

            {/* Registration Deadline Banner */}
            <div className="bg-orange-500 text-white text-center py-4 mb-6">
              <p className="font-bold">Registration Deadline: May 28th 2025</p>
            </div>
          </div>

          {/* Right Column - Event Details & Registration */}
          <div>
            <div className="bg-gray-50 p-6 rounded-md mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Event Details</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-purple-800">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <span className="font-bold">Date:</span> 7-14th June, 2025
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-purple-800">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span className="font-bold">Registration:</span> ₦50,000
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-purple-800">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <span className="font-bold">Venue:</span> Calabar
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-purple-800">
                    <Phone size={24} />
                  </div>
                  <div>
                    <span className="font-bold">Contact:</span> 08091533339
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-300 rounded-md p-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Register Here</h3>

              {submitResult && (
                <div
                  className={`mb-6 p-4 rounded-md ${
                    submitResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  <p className="font-medium">{submitResult.message}</p>
                  {submitResult.success && submitResult.registrationId && (
                    <p className="mt-2">
                      Your registration ID: <span className="font-bold">{submitResult.registrationId}</span>
                    </p>
                  )}
                </div>
              )}              <form className="space-y-4" onSubmit={handleSubmit}>
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
                      className={`w-full p-2 border rounded-md ${
                        touched.firstName && errors.firstName ? "border-red-500" : ""
                      }`}
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={() => handleBlur("firstName")}
                      required
                    />
                    {touched.firstName && errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="middleName" className="block mb-2">
                      Middle Name
                    </label>
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
                    className={`w-full p-2 border rounded-md ${
                      touched.lastName && errors.lastName ? "border-red-500" : ""
                    }`}
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("lastName")}
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
                    onBlur={() => handleBlur("email")}
                    required
                  />
                  {touched.email && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block mb-2">
                      Phone/Mobile/Whatsapp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Mobile Number"
                      className={`w-full p-2 border rounded-md ${
                        touched.phone && errors.phone ? "border-red-500" : ""
                      }`}
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur("phone")}
                      required
                    />
                    {touched.phone && errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label htmlFor="altPhone" className="block mb-2">
                      Alternate Phone Number
                    </label>
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
                  {touched.gender && errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
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
                    onBlur={() => handleBlur("dob")}
                    required
                  />
                  {touched.dob && errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                </div>

                <div>
                  <label htmlFor="maritalStatus" className="block mb-2">
                    Marital Status
                  </label>
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
                  <label htmlFor="city" className="block mb-2">
                    City Of Residence
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your city of residence"
                    className="w-full p-2 border rounded-md"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block mb-2">
                    Contact Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Enter your contact address"
                    className="w-full p-2 border rounded-md"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="institute" className="block mb-2">
                    Institute of Undergraduate Training
                  </label>
                  <input
                    type="text"
                    id="institute"
                    name="institute"
                    placeholder="Enter your institute"
                    className="w-full p-2 border rounded-md"
                    value={formData.institute}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="professionalStatus" className="block mb-2">
                    Professional Status/Cadre
                  </label>
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
                  <label htmlFor="workplace" className="block mb-2">
                    Current Workplace
                  </label>
                  <input
                    type="text"
                    id="workplace"
                    name="workplace"
                    placeholder="Enter your current workplace"
                    className="w-full p-2 border rounded-md"
                    value={formData.workplace}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    Have you attended this program before?
                  </label>
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
                  <label htmlFor="expectations" className="block mb-2">
                    What are your expectations from this program?
                  </label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    rows={3}
                    placeholder="Enter your expectations"
                    className="w-full p-2 border rounded-md"
                    value={formData.expectations}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="hearAbout" className="block mb-2">
                    How did you hear about this program?
                  </label>
                  <input
                    type="text"
                    id="hearAbout"
                    name="hearAbout"
                    placeholder="e.g., Social media, Friend, Colleague"
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
          </div>
        </div>
      </main>
    </div>
  )
}
