import * as React from 'react';

interface ConfirmationEmailProps {
  firstName: string;
  registrationId: string;
  fullName: string;
  email: string;
}

export const ConfirmationEmail: React.FC<ConfirmationEmailProps> = ({
  firstName,
  registrationId,
  fullName,
  email,
}) => (
  <div style={{ 
    fontFamily: 'Arial, sans-serif', 
    maxWidth: '600px', 
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    padding: '20px'
  }}>
    {/* Header */}
    <div style={{ 
      backgroundColor: '#7c3aed', 
      color: 'white', 
      padding: '30px 20px', 
      textAlign: 'center',
      borderRadius: '8px 8px 0 0'
    }}>
      <h1 style={{ margin: '0', fontSize: '28px' }}>IFEHL 2025</h1>
      <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: '0.9' }}>
        Christian Medical and Dental Association of Nigeria
      </p>
    </div>

    {/* Main Content */}
    <div style={{ 
      backgroundColor: 'white', 
      padding: '40px 30px',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Success Message */}
      <div style={{ 
        backgroundColor: '#ecfdf5', 
        border: '1px solid #10b981', 
        borderRadius: '6px', 
        padding: '15px', 
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          color: '#065f46', 
          margin: '0 0 10px 0', 
          fontSize: '20px' 
        }}>
          ✅ Registration Received!
        </h2>
        <p style={{ 
          color: '#047857', 
          margin: '0', 
          fontSize: '14px' 
        }}>
          Your registration has been successfully submitted
        </p>
      </div>

      <h2 style={{ color: '#374151', marginBottom: '20px' }}>
        Dear {firstName},
      </h2>

      <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
        Thank you for registering for <strong>IFEHL 2025</strong>! We have successfully received your registration 
        and you should receive this confirmation email as proof of your submission.
      </p>

      {/* Registration Details */}
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        border: '1px solid #d1d5db', 
        borderRadius: '6px', 
        padding: '20px', 
        marginBottom: '25px' 
      }}>
        <h3 style={{ 
          color: '#374151', 
          margin: '0 0 15px 0', 
          fontSize: '18px' 
        }}>
          Your Registration Details:
        </h3>
        <div style={{ color: '#4b5563', lineHeight: '1.8' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Registration ID:</strong> {registrationId}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Name:</strong> {fullName}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Email:</strong> {email}
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Registration Date:</strong> {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Event Details */}
      <div style={{ 
        backgroundColor: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: '6px', 
        padding: '20px', 
        marginBottom: '25px' 
      }}>
        <h3 style={{ 
          color: '#92400e', 
          margin: '0 0 15px 0', 
          fontSize: '18px' 
        }}>
          Event Information:
        </h3>
        <div style={{ color: '#78350f', lineHeight: '1.8' }}>
          <p style={{ margin: '5px 0' }}>
            <strong>📅 Date:</strong> November, 2025
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>📍 Venue:</strong> Wholeness House, Gwagalada, Abuja
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>💰 Registration Fee:</strong> ₦50,000
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>📞 Contact:</strong> 08091533339
          </p>
        </div>
      </div>

      {/* Payment Information */}
      <div style={{ 
        backgroundColor: '#fef2f2', 
        border: '1px solid #ef4444', 
        borderRadius: '6px', 
        padding: '20px', 
        marginBottom: '25px' 
      }}>
        <h3 style={{ 
          color: '#dc2626', 
          margin: '0 0 15px 0', 
          fontSize: '18px' 
        }}>
          ⚠️ Important: Complete Your Payment
        </h3>
        <p style={{ color: '#991b1b', lineHeight: '1.6', marginBottom: '15px' }}>
          Your registration is <strong>not complete</strong> until payment is made. Please transfer ₦50,000 to:
        </p>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          color: '#374151'
        }}>
          <p style={{ margin: '5px 0' }}>
            <strong>Account Name:</strong> Christian Medical and Dental Association of Nigeria
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Account Number:</strong> 1018339742
          </p>
          <p style={{ margin: '5px 0' }}>
            <strong>Bank:</strong> UBA
          </p>
        </div>
        <p style={{ 
          color: '#991b1b', 
          fontSize: '14px', 
          marginTop: '15px',
          fontStyle: 'italic' 
        }}>
          Please use your Registration ID ({registrationId}) as the payment reference.
        </p>
      </div>

      {/* Next Steps */}
      <div style={{ 
        backgroundColor: '#eff6ff', 
        border: '1px solid #3b82f6', 
        borderRadius: '6px', 
        padding: '20px', 
        marginBottom: '25px' 
      }}>
        <h3 style={{ 
          color: '#1e40af', 
          margin: '0 0 15px 0', 
          fontSize: '18px' 
        }}>
          What's Next?
        </h3>
        <ol style={{ color: '#1e3a8a', lineHeight: '1.8', margin: '0', paddingLeft: '20px' }}>
          <li>Complete your payment using the details above</li>
          <li>Keep this email and your Registration ID safe</li>
          <li>Wait for confirmation of payment processing</li>
          <li>You will receive further instructions closer to the event date</li>
        </ol>
      </div>

      <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
        If you have any questions or concerns, please don't hesitate to contact us at 
        <strong> 08091533339</strong> or email us at 
        <strong> office@cmdanigeria.org</strong>.
      </p>

      <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
        We look forward to seeing you at IFEHL 2025!
      </p>

      <div style={{ 
        borderTop: '1px solid #e5e7eb', 
        paddingTop: '20px', 
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '14px', 
          margin: '0' 
        }}>
          Best regards,<br />
          <strong>CMDA Nigeria Team</strong>
        </p>
      </div>
    </div>

    {/* Footer */}
    <div style={{ 
      textAlign: 'center', 
      padding: '20px', 
      color: '#6b7280', 
      fontSize: '12px' 
    }}>
      <p style={{ margin: '0 0 10px 0' }}>
        Christian Medical and Dental Association of Nigeria
      </p>
      <p style={{ margin: '0' }}>
        This email was sent to {email} regarding your IFEHL 2025 registration.
      </p>
    </div>
  </div>
);