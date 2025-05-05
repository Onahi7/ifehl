"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { headers } from "next/headers"

// Type for form data
type FormData = {
  firstName: string
  middleName: string
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
    const sql = neon(process.env.DATABASE_URL!)    // Insert the registration data into the database
    const result = await sql`
      INSERT INTO registrations (
        first_name, 
        middle_name,
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
        ${formData.middleName || null},
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

// Function to fetch all registrations
export async function fetchRegistrations() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT 
        id, 
        first_name, 
        middle_name,
        last_name, 
        email, 
        phone, 
        status, 
        created_at 
      FROM registrations 
      ORDER BY created_at DESC
    `
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error("Error fetching registrations:", error)
    throw new Error("Failed to fetch registrations")
  }
}

// Function to approve a registration
export async function approveRegistration(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      UPDATE registrations 
      SET status = 'approved'
      WHERE id = ${id}
    `
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error("Error approving registration:", error)
    throw new Error("Failed to approve registration")
  }
}

// Function to handle admin login
export async function login(email: string, password: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const bcrypt = require('bcryptjs')

    // Get user from database
    const user = await sql`
      SELECT * FROM admin_users 
      WHERE email = ${email}
      LIMIT 1
    `

    if (!user || user.length === 0) {
      return {
        success: false,
        message: "Invalid credentials"
      }
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user[0].password_hash)
    if (!validPassword) {
      return {
        success: false,
        message: "Invalid credentials"
      }
    }

    // Generate the token
    const token = generateToken(user[0].id)

    // Set the cookie
    const cookieStore = await cookies()
    await cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 1 week in seconds
    })

    return {
      success: true,
      message: "Logged in successfully"
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login"
    }
  }
}

// Function to fetch registration details
export async function fetchRegistrationDetails(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    const result = await sql`
      SELECT * FROM registrations 
      WHERE id = ${id}
      LIMIT 1
    `
    return JSON.parse(JSON.stringify(result[0]))
  } catch (error) {
    console.error("Error fetching registration details:", error)
    throw new Error("Failed to fetch registration details")
  }
}

// Function to update payment status
export async function updatePaymentStatus(id: number, status: string, reference?: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      UPDATE registrations 
      SET 
        payment_status = ${status},
        payment_reference = ${reference || null},
        payment_date = ${status === 'paid' ? new Date() : null}
      WHERE id = ${id}
    `
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error("Error updating payment status:", error)
    throw new Error("Failed to update payment status")
  }
}

// Function to bulk approve registrations
export async function bulkApproveRegistrations(ids: number[]) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      UPDATE registrations 
      SET status = 'approved'
      WHERE id = ANY(${ids})
    `
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error("Error bulk approving registrations:", error)
    throw new Error("Failed to approve registrations")
  }
}

// Helper function to generate JWT token
function generateToken(userId: number) {
  const jwt = require('jsonwebtoken')
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}
