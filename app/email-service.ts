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
  fullName: string
) {
  try {
    const data = await resend.emails.send({
      from: `CMDA-IFEHL <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: 'Registration Confirmation - IFEHL 2025',
      react: createElement(ConfirmationEmail, {
        firstName,
        registrationId,
        fullName,
        email: to,
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

export async function sendApprovalEmail(to: string, firstName: string, registrationId: string) {
  try {
    const data = await resend.emails.send({
      from: `CMDA-IFEHL <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: 'Registration Approved - IFEHL 2025',
      react: createElement(ApprovalEmail, {
        firstName,
        registrationId,
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

export async function sendReminderEmail(to: string, firstName: string, registrationId: string) {
  try {
    const data = await resend.emails.send({
      from: `CMDA-IFEHL <${process.env.RESEND_FROM_EMAIL}>`,
      to: [to],
      subject: 'Registration Reminder - IFEHL 2025',
      react: createElement(ReminderEmail, {
        firstName,
        registrationId,
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
