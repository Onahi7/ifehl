"use server"

import { neon } from "@neondatabase/serverless"
import { revalidatePath } from "next/cache"

// Types
export type Campaign = {
  id: number
  slug: string
  title: string
  subtitle?: string
  description?: string
  start_date: string
  end_date: string
  location: string
  venue_details?: string
  registration_fee: number
  registration_deadline?: string
  status: 'draft' | 'published' | 'closed' | 'archived'
  is_registration_open: boolean
  target_participants?: number
  banner_image_url?: string
  logo_image_url?: string
  contact_phone?: string
  contact_email?: string
  payment_account_name?: string
  payment_account_number?: string
  payment_bank?: string
  payment_instructions?: string
  social_facebook?: string
  social_twitter?: string
  social_instagram?: string
  social_youtube?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export type CampaignFormData = {
  slug: string
  title: string
  subtitle?: string
  description?: string
  startDate: string
  endDate: string
  location: string
  venueDetails?: string
  registrationFee: number
  registrationDeadline?: string
  targetParticipants?: number
  bannerImageUrl?: string
  logoImageUrl?: string
  contactPhone?: string
  contactEmail?: string
  paymentAccountName?: string
  paymentAccountNumber?: string
  paymentBank?: string
  paymentInstructions?: string
  socialFacebook?: string
  socialTwitter?: string
  socialInstagram?: string
  socialYoutube?: string
}

export type CampaignRegistration = {
  id: number
  campaign_id: number
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
  status: 'pending' | 'approved' | 'rejected'
  payment_status: 'unpaid' | 'paid' | 'refunded'
  payment_reference?: string
  payment_date?: string
  created_at: string
}

export type RegistrationFormData = {
  firstName: string
  middleName?: string
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

// ============ CAMPAIGN CRUD ============

// Fetch all campaigns
export async function fetchCampaigns(includeArchived = false) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    let result
    if (includeArchived) {
      result = await sql`
        SELECT * FROM campaigns 
        ORDER BY created_at DESC
      `
    } else {
      result = await sql`
        SELECT * FROM campaigns 
        WHERE status != 'archived'
        ORDER BY created_at DESC
      `
    }
    
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    throw new Error("Failed to fetch campaigns")
  }
}

// Fetch published campaigns for public landing page
export async function fetchPublishedCampaigns() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT * FROM campaigns 
      WHERE status = 'published'
      ORDER BY start_date ASC
    `
    
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error("Error fetching published campaigns:", error)
    throw new Error("Failed to fetch published campaigns")
  }
}

// Fetch single campaign by slug
export async function fetchCampaignBySlug(slug: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT * FROM campaigns 
      WHERE slug = ${slug}
      LIMIT 1
    `
    
    if (result.length === 0) {
      return null
    }
    
    return JSON.parse(JSON.stringify(result[0]))
  } catch (error) {
    console.error("Error fetching campaign:", error)
    throw new Error("Failed to fetch campaign")
  }
}

// Fetch single campaign by ID
export async function fetchCampaignById(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT * FROM campaigns 
      WHERE id = ${id}
      LIMIT 1
    `
    
    if (result.length === 0) {
      return null
    }
    
    return JSON.parse(JSON.stringify(result[0]))
  } catch (error) {
    console.error("Error fetching campaign:", error)
    throw new Error("Failed to fetch campaign")
  }
}

// Create a new campaign
export async function createCampaign(data: CampaignFormData) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      INSERT INTO campaigns (
        slug, title, subtitle, description, 
        start_date, end_date, location, venue_details,
        registration_fee, registration_deadline, target_participants,
        banner_image_url, logo_image_url,
        contact_phone, contact_email,
        payment_account_name, payment_account_number, payment_bank, payment_instructions,
        social_facebook, social_twitter, social_instagram, social_youtube,
        status, is_registration_open
      ) VALUES (
        ${data.slug.toLowerCase().replace(/\s+/g, '-')},
        ${data.title},
        ${data.subtitle || null},
        ${data.description || null},
        ${data.startDate},
        ${data.endDate},
        ${data.location},
        ${data.venueDetails || null},
        ${data.registrationFee},
        ${data.registrationDeadline || null},
        ${data.targetParticipants || null},
        ${data.bannerImageUrl || null},
        ${data.logoImageUrl || null},
        ${data.contactPhone || null},
        ${data.contactEmail || null},
        ${data.paymentAccountName || null},
        ${data.paymentAccountNumber || null},
        ${data.paymentBank || null},
        ${data.paymentInstructions || null},
        ${data.socialFacebook || null},
        ${data.socialTwitter || null},
        ${data.socialInstagram || null},
        ${data.socialYoutube || null},
        'draft',
        false
      ) RETURNING id
    `
    
    revalidatePath('/admin/campaigns')
    
    return {
      success: true,
      campaignId: result[0].id,
      message: "Campaign created successfully"
    }
  } catch (error: any) {
    console.error("Error creating campaign:", error)
    
    if (error.message?.includes('unique') || error.message?.includes('duplicate')) {
      return {
        success: false,
        message: "A campaign with this slug already exists. Please use a different slug."
      }
    }
    
    return {
      success: false,
      message: "Failed to create campaign"
    }
  }
}

// Update a campaign
export async function updateCampaign(id: number, data: Partial<CampaignFormData>) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaigns SET
        title = COALESCE(${data.title || null}, title),
        subtitle = COALESCE(${data.subtitle || null}, subtitle),
        description = COALESCE(${data.description || null}, description),
        start_date = COALESCE(${data.startDate || null}, start_date),
        end_date = COALESCE(${data.endDate || null}, end_date),
        location = COALESCE(${data.location || null}, location),
        venue_details = COALESCE(${data.venueDetails || null}, venue_details),
        registration_fee = COALESCE(${data.registrationFee ?? null}, registration_fee),
        registration_deadline = COALESCE(${data.registrationDeadline || null}, registration_deadline),
        target_participants = COALESCE(${data.targetParticipants || null}, target_participants),
        banner_image_url = COALESCE(${data.bannerImageUrl || null}, banner_image_url),
        logo_image_url = COALESCE(${data.logoImageUrl || null}, logo_image_url),
        contact_phone = COALESCE(${data.contactPhone || null}, contact_phone),
        contact_email = COALESCE(${data.contactEmail || null}, contact_email),
        payment_account_name = COALESCE(${data.paymentAccountName || null}, payment_account_name),
        payment_account_number = COALESCE(${data.paymentAccountNumber || null}, payment_account_number),
        payment_bank = COALESCE(${data.paymentBank || null}, payment_bank),
        payment_instructions = COALESCE(${data.paymentInstructions || null}, payment_instructions),
        social_facebook = COALESCE(${data.socialFacebook || null}, social_facebook),
        social_twitter = COALESCE(${data.socialTwitter || null}, social_twitter),
        social_instagram = COALESCE(${data.socialInstagram || null}, social_instagram),
        social_youtube = COALESCE(${data.socialYoutube || null}, social_youtube),
        updated_at = NOW()
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    revalidatePath(`/admin/campaigns/${id}`)
    
    return { success: true, message: "Campaign updated successfully" }
  } catch (error) {
    console.error("Error updating campaign:", error)
    return { success: false, message: "Failed to update campaign" }
  }
}

// Publish a campaign
export async function publishCampaign(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaigns SET
        status = 'published',
        is_registration_open = true,
        published_at = NOW(),
        updated_at = NOW()
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    
    return { success: true, message: "Campaign published successfully" }
  } catch (error) {
    console.error("Error publishing campaign:", error)
    return { success: false, message: "Failed to publish campaign" }
  }
}

// Toggle campaign registration
export async function toggleCampaignRegistration(id: number, isOpen: boolean) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaigns SET
        is_registration_open = ${isOpen},
        updated_at = NOW()
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    
    return { success: true, message: isOpen ? "Registration opened" : "Registration closed" }
  } catch (error) {
    console.error("Error toggling registration:", error)
    return { success: false, message: "Failed to toggle registration" }
  }
}

// Close a campaign
export async function closeCampaign(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaigns SET
        status = 'closed',
        is_registration_open = false,
        updated_at = NOW()
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    
    return { success: true, message: "Campaign closed" }
  } catch (error) {
    console.error("Error closing campaign:", error)
    return { success: false, message: "Failed to close campaign" }
  }
}

// Archive a campaign
export async function archiveCampaign(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaigns SET
        status = 'archived',
        is_registration_open = false,
        updated_at = NOW()
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    
    return { success: true, message: "Campaign archived" }
  } catch (error) {
    console.error("Error archiving campaign:", error)
    return { success: false, message: "Failed to archive campaign" }
  }
}

// Delete a campaign (only drafts)
export async function deleteCampaign(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Only allow deleting drafts
    const campaign = await sql`SELECT status FROM campaigns WHERE id = ${id}`
    if (campaign[0]?.status !== 'draft') {
      return { success: false, message: "Only draft campaigns can be deleted" }
    }
    
    await sql`DELETE FROM campaigns WHERE id = ${id}`
    
    revalidatePath('/admin/campaigns')
    
    return { success: true, message: "Campaign deleted" }
  } catch (error) {
    console.error("Error deleting campaign:", error)
    return { success: false, message: "Failed to delete campaign" }
  }
}

// ============ CAMPAIGN REGISTRATIONS ============

// Submit registration for a campaign
export async function submitCampaignRegistration(campaignId: number, formData: RegistrationFormData) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Check if campaign exists and is accepting registrations
    const campaign = await sql`
      SELECT id, title, is_registration_open, status 
      FROM campaigns 
      WHERE id = ${campaignId}
    `
    
    if (campaign.length === 0) {
      return { success: false, message: "Campaign not found" }
    }
    
    if (!campaign[0].is_registration_open || campaign[0].status !== 'published') {
      return { success: false, message: "Registration is currently closed for this campaign" }
    }
    
    const result = await sql`
      INSERT INTO campaign_registrations (
        campaign_id,
        first_name, middle_name, last_name,
        email, phone, alt_phone,
        gender, dob, marital_status,
        city, address, institute,
        professional_status, workplace, attended,
        expectations, hear_about
      ) VALUES (
        ${campaignId},
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
        ${formData.attended === 'yes' ? true : formData.attended === 'no' ? false : null},
        ${formData.expectations || null},
        ${formData.hearAbout || null}
      ) RETURNING id
    `
    
    const registrationId = result[0]?.id
    
    // Send confirmation email (don't block on email failure)
    try {
      const { sendConfirmationEmail } = await import('../email-service')
      const fullName = `${formData.firstName} ${formData.middleName || ''} ${formData.lastName}`.trim()
      await sendConfirmationEmail(
        formData.email,
        formData.firstName,
        registrationId.toString(),
        fullName,
        {
          title: campaign[0].title,
          start_date: campaign[0].start_date,
          end_date: campaign[0].end_date,
          location: campaign[0].location,
          registration_fee: campaign[0].registration_fee,
          payment_account_name: campaign[0].payment_account_name,
          payment_account_number: campaign[0].payment_account_number,
          payment_bank: campaign[0].payment_bank,
          contact_phone: campaign[0].contact_phone,
          payment_instructions: campaign[0].payment_instructions,
        }
      )
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError)
      // Don't fail the registration if email fails
    }
    
    return {
      success: true,
      message: "Registration submitted successfully!",
      registrationId
    }
  } catch (error: any) {
    console.error("Error submitting registration:", error)
    
    if (error.message?.includes('unique_email_per_campaign')) {
      return {
        success: false,
        message: "This email has already been registered for this campaign."
      }
    }
    
    return {
      success: false,
      message: "Failed to submit registration. Please try again."
    }
  }
}

// Fetch registrations for a campaign
export async function fetchCampaignRegistrations(campaignId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT * FROM campaign_registrations 
      WHERE campaign_id = ${campaignId}
      ORDER BY created_at DESC
    `
    
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error("Error fetching registrations:", error)
    throw new Error("Failed to fetch registrations")
  }
}

// Get campaign stats
export async function getCampaignStats(campaignId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'approved') as approved,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
        COUNT(*) FILTER (WHERE payment_status = 'paid') as paid,
        COUNT(*) FILTER (WHERE payment_status = 'unpaid') as unpaid
      FROM campaign_registrations 
      WHERE campaign_id = ${campaignId}
    `
    
    return JSON.parse(JSON.stringify(stats[0]))
  } catch (error) {
    console.error("Error fetching campaign stats:", error)
    throw new Error("Failed to fetch campaign stats")
  }
}

// Approve a campaign registration
export async function approveCampaignRegistration(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaign_registrations 
      SET status = 'approved'
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    
    return { success: true }
  } catch (error) {
    console.error("Error approving registration:", error)
    throw new Error("Failed to approve registration")
  }
}

// Update payment status for campaign registration
export async function updateCampaignPaymentStatus(id: number, status: string, reference?: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`
      UPDATE campaign_registrations SET
        payment_status = ${status},
        payment_reference = ${reference || null},
        payment_date = ${status === 'paid' ? new Date().toISOString() : null}
      WHERE id = ${id}
    `
    
    revalidatePath('/admin/campaigns')
    
    return { success: true }
  } catch (error) {
    console.error("Error updating payment status:", error)
    throw new Error("Failed to update payment status")
  }
}

// ============ CAMPAIGN IMAGES ============

// Add image to campaign
export async function addCampaignImage(campaignId: number, imageUrl: string, imageType: string = 'gallery', altText?: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    // Get max display order
    const maxOrder = await sql`
      SELECT COALESCE(MAX(display_order), 0) as max_order 
      FROM campaign_images 
      WHERE campaign_id = ${campaignId}
    `
    
    const result = await sql`
      INSERT INTO campaign_images (campaign_id, image_url, image_type, alt_text, display_order)
      VALUES (${campaignId}, ${imageUrl}, ${imageType}, ${altText || null}, ${maxOrder[0].max_order + 1})
      RETURNING id
    `
    
    revalidatePath(`/admin/campaigns/${campaignId}`)
    
    return { success: true, imageId: result[0].id }
  } catch (error) {
    console.error("Error adding image:", error)
    return { success: false, message: "Failed to add image" }
  }
}

// Fetch campaign images
export async function fetchCampaignImages(campaignId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT * FROM campaign_images 
      WHERE campaign_id = ${campaignId}
      ORDER BY display_order ASC
    `
    
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error("Error fetching images:", error)
    throw new Error("Failed to fetch images")
  }
}

// Delete campaign image
export async function deleteCampaignImage(id: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    await sql`DELETE FROM campaign_images WHERE id = ${id}`
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { success: false, message: "Failed to delete image" }
  }
}

// ============ HELPER FUNCTIONS ============

// Get published campaigns for public display
export async function getPublishedCampaigns() {
  try {
    const sql = neon(process.env.DATABASE_URL!)
    
    const result = await sql`
      SELECT id, slug, title, subtitle, start_date, end_date, location, 
             registration_fee, banner_image_url, is_registration_open
      FROM campaigns 
      WHERE status = 'published'
      ORDER BY start_date ASC
    `
    
    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.error("Error fetching published campaigns:", error)
    throw new Error("Failed to fetch campaigns")
  }
}
