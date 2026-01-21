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
  }
) {
  try {
    const emailSubject = campaignData?.title 
      ? `Registration Confirmation - ${campaignData.title}`
      : 'Registration Confirmation - IFEHL 2025'

    const campaignDates = campaignData ? 
      `${new Date(campaignData.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${new Date(campaignData.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}` :
      undefined
      
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
      }),
    });

    // Track that the email was sent
    await trackEmailSent(parseInt(registrationId), 'confirmation' as any);

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
  }
) {
  try {
    const emailSubject = campaignData?.title 
      ? `Registration Approved - ${campaignData.title}`
      : 'Registration Approved - IFEHL 2025'

    const campaignDates = campaignData ? 
      `${new Date(campaignData.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${new Date(campaignData.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}` :
      undefined

    const paymentDeadline = campaignData?.registration_deadline ? 
      new Date(campaignData.registration_deadline).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) :
      undefined

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
      }),
    });

    // Track that the email was sent
    await trackEmailSent(parseInt(registrationId), 'approval');

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
  }
) {
  try {
    const emailSubject = campaignData?.title 
      ? `Payment Reminder - ${campaignData.title}`
      : 'Registration Reminder - IFEHL 2025'

    const campaignDates = campaignData ? 
      `${new Date(campaignData.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })} - ${new Date(campaignData.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}` :
      undefined

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
      }),
    });

    // Track that the email was sent
    await trackEmailSent(parseInt(registrationId), 'reminder');

    return { success: true, data };
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return { success: false, error };
  }
}
