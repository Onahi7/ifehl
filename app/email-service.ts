'use server';

import { Resend } from 'resend';
import { createElement } from 'react';
import { ApprovalEmail } from './emails/approval-email';
import { ReminderEmail } from './emails/reminder-email';
import { ConfirmationEmail } from './emails/confirmation-email';
import { trackEmailSent } from './actions';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  to: string, 
  firstName: string, 
  registrationId: string, 
  fullName: string,
  campaignData?: {
    title: string
    start_date: string
    end_date: string
    location: string
    registration_fee: number
    payment_account_name?: string
    payment_account_number?: string
    payment_bank?: string
    contact_phone?: string
    payment_instructions?: string
    logo_image_url?: string
    banner_image_url?: string
  }
) {
  try {
    console.log('sendConfirmationEmail - campaignData:', campaignData)

    const emailSubject = campaignData?.title 
      ? `Registration Confirmation - ${campaignData.title}`
      : 'Registration Confirmation - IFEHL 2025'

    let campaignDates: string | undefined
    if (campaignData?.start_date && campaignData?.end_date) {
      try {
        const startDate = new Date(campaignData.start_date)
        const endDate = new Date(campaignData.end_date)
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          campaignDates = `${startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
        }
      } catch (dateError) {
        console.error('Error formatting campaign dates:', dateError)
      }
    }
      
    const data = await resend.emails.send({
      from: `IFEHL Registration <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: emailSubject,
      react: createElement(ConfirmationEmail, {
        firstName,
        registrationId,
        fullName,
        email: to,
        campaignTitle: campaignData?.title || 'IFEHL 2025',
        campaignDates,
        campaignVenue: campaignData?.location,
        registrationFee: campaignData?.registration_fee,
        accountName: campaignData?.payment_account_name,
        accountNumber: campaignData?.payment_account_number,
        bankName: campaignData?.payment_bank,
        contactPhone: campaignData?.contact_phone,
        paymentInstructions: campaignData?.payment_instructions,
        logoUrl: campaignData?.logo_image_url || campaignData?.banner_image_url,
      }),
    });

    // Track that the email was sent (skip for test IDs)
    const numericId = parseInt(registrationId);
    if (!isNaN(numericId)) {
      await trackEmailSent(numericId, 'confirmation' as any);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error };
  }
}

export async function sendApprovalEmail(
  to: string, 
  firstName: string, 
  registrationId: string,
  campaignData?: {
    title: string
    start_date: string
    end_date: string
    location: string
    registration_fee: number
    payment_account_name?: string
    payment_account_number?: string
    payment_bank?: string
    contact_phone?: string
    payment_instructions?: string
    registration_deadline?: string
    logo_image_url?: string
    banner_image_url?: string
  }
) {
  try {
    console.log('sendApprovalEmail - campaignData:', campaignData)

    const emailSubject = campaignData?.title 
      ? `Registration Approved - ${campaignData.title}`
      : 'Registration Approved - IFEHL 2025'

    let campaignDates: string | undefined
    if (campaignData?.start_date && campaignData?.end_date) {
      try {
        const startDate = new Date(campaignData.start_date)
        const endDate = new Date(campaignData.end_date)
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          campaignDates = `${startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
        }
      } catch (dateError) {
        console.error('Error formatting campaign dates:', dateError)
      }
    }

    let paymentDeadline: string | undefined
    if (campaignData?.registration_deadline) {
      try {
        const deadline = new Date(campaignData.registration_deadline)
        if (!isNaN(deadline.getTime())) {
          paymentDeadline = deadline.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
        }
      } catch (dateError) {
        console.error('Error formatting payment deadline:', dateError)
      }
    }

    const data = await resend.emails.send({
      from: `IFEHL Registration <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: emailSubject,
      react: createElement(ApprovalEmail, {
        firstName,
        registrationId,
        campaignTitle: campaignData?.title,
        campaignDates,
        campaignVenue: campaignData?.location,
        registrationFee: campaignData?.registration_fee,
        accountName: campaignData?.payment_account_name,
        accountNumber: campaignData?.payment_account_number,
        bankName: campaignData?.payment_bank,
        contactPhone: campaignData?.contact_phone,
        paymentDeadline,
        paymentInstructions: campaignData?.payment_instructions,
        logoUrl: campaignData?.logo_image_url || campaignData?.banner_image_url,
      }),
    });

    // Track that the email was sent (skip for test IDs)
    const numericId = parseInt(registrationId);
    if (!isNaN(numericId)) {
      await trackEmailSent(numericId, 'approval');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending approval email:', error);
    return { success: false, error };
  }
}

export async function sendReminderEmail(
  to: string, 
  firstName: string, 
  registrationId: string,
  campaignData?: {
    title: string
    start_date: string
    end_date: string
    location: string
    registration_fee: number
    payment_account_name?: string
    payment_account_number?: string
    payment_bank?: string
    contact_phone?: string
    payment_instructions?: string
    logo_image_url?: string
    banner_image_url?: string
  }
) {
  try {
    console.log('sendReminderEmail - campaignData:', campaignData)

    const emailSubject = campaignData?.title 
      ? `Payment Reminder - ${campaignData.title}`
      : 'Registration Reminder - IFEHL 2025'

    let campaignDates: string | undefined
    if (campaignData?.start_date && campaignData?.end_date) {
      try {
        const startDate = new Date(campaignData.start_date)
        const endDate = new Date(campaignData.end_date)
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          campaignDates = `${startDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${endDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
        }
      } catch (dateError) {
        console.error('Error formatting campaign dates:', dateError)
      }
    }

    const data = await resend.emails.send({
      from: `IFEHL Registration <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: emailSubject,
      react: createElement(ReminderEmail, {
        firstName,
        registrationId,
        campaignTitle: campaignData?.title,
        campaignDates,
        campaignVenue: campaignData?.location,
        registrationFee: campaignData?.registration_fee,
        accountName: campaignData?.payment_account_name,
        accountNumber: campaignData?.payment_account_number,
        bankName: campaignData?.payment_bank,
        contactPhone: campaignData?.contact_phone,
        paymentInstructions: campaignData?.payment_instructions,
        logoUrl: campaignData?.logo_image_url || campaignData?.banner_image_url,
      }),
    });

    // Track that the email was sent (skip for test IDs)
    const numericId = parseInt(registrationId);
    if (!isNaN(numericId)) {
      await trackEmailSent(numericId, 'reminder');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return { success: false, error };
  }
}
