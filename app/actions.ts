"use server"

import { neon } from "@neondatabase/serverless"

// Type for form data
type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  altPhone?: string
  gender: string
  dob: string
  maritalStatus?: string
  city?: string
  address?: string
  institute?: string
  professionalStatus?: string
  workplace?: string
  attended?: string
  expectations?: string
  hearAbout?: string
}

// Function to submit registration to the database
export async function submitRegistration(formData: FormData) {
  try {
    // Initialize the Neon SQL client
    const sql = neon(process.env.DATABASE_URL!)

    // Insert the registration data into the database
    const result = await sql`
      INSERT INTO registrations (
        first_name, 
        last_name, 
        email, 
        phone, 
        alt_phone, 
        gender, 
        dob, 
        marital_status, 
        city, 
        address, 
        institute, 
        professional_status, 
        workplace, 
        attended, 
        expectations, 
        hear_about
      ) VALUES (
        ${formData.firstName},
        ${formData.lastName},
        ${formData.email},
        ${formData.phone},
        ${formData.altPhone || null},
        ${formData.gender},
        ${formData.dob},
        ${formData.maritalStatus || null},
        ${formData.city || null},
        ${formData.address || null},
        ${formData.institute || null},
        ${formData.professionalStatus || null},
        ${formData.workplace || null},
        ${formData.attended === "yes" ? true : formData.attended === "no" ? false : null},
        ${formData.expectations || null},
        ${formData.hearAbout || null}
      ) RETURNING id
    `

    // Get the registration ID from the result
    const registrationId = result[0]?.id

    const response = {
      success: true,
      message: "Registration submitted successfully!",
      registrationId: Number(registrationId) || null,
    }
    return JSON.parse(JSON.stringify(response))
  } catch (error: any) {
    console.error("Error submitting registration:", error)

    // Check for duplicate email error
    const errorResponse = {
      success: false,
      message: error.message?.includes("unique_email_registration")
        ? "This email address has already been registered. Please use a different email."
        : "Failed to submit registration. Please try again.",
      registrationId: null,
    }
    return JSON.parse(JSON.stringify(errorResponse))
  }
}
