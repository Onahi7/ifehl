import * as React from 'react';

interface ApprovalEmailProps {
  firstName: string;
  registrationId: string;
}

export const ApprovalEmail: React.FC<ApprovalEmailProps> = ({
  firstName,
  registrationId,
}) => (
  <div style={{
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#333',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  }}>
    {/* Logo Header */}
    <div style={{
      textAlign: 'center' as const,
      marginBottom: '20px',
    }}>
      <img 
        src="https://ifehl.cmdanigeria.org/IfHEL.%20Logo.png" 
        alt="IFEHL Logo" 
        style={{
          maxWidth: '150px',
          height: 'auto',
        }}
      />
    </div>

    <div style={{
      backgroundColor: '#6633cc',
      padding: '20px',
      borderRadius: '8px 8px 0 0',
      textAlign: 'center' as const,
    }}>
      <h1 style={{
        color: 'white',
        margin: '0',
        fontSize: '24px',
        fontWeight: 'bold',
      }}>
        Registration Approved - IFEHL 2025 (03)
      </h1>
    </div>
    
    <div style={{
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '0 0 8px 8px',
      border: '1px solid #e1e1e1',
      borderTop: 'none',
    }}>
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        Dear <span style={{ fontWeight: 'bold' }}>{firstName}</span>,
      </p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        We are pleased to inform you that your registration (ID: <span style={{ fontWeight: 'bold', color: '#6633cc' }}>{registrationId}</span>) for IFEHL 2025 (03) has been approved.
      </p>
      
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '0', color: '#6633cc' }}>
          Event Details
        </h2>
        
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ minWidth: '120px', fontWeight: 'bold' }}>Date:</div>
          <div>16-23rd November, 2025</div>
        </div>
        
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ minWidth: '120px', fontWeight: 'bold' }}>Venue:</div>
          <div>Wholeness House, Gwagalada, Abuja</div>
        </div>

        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ minWidth: '120px', fontWeight: 'bold' }}>Registration Fee:</div>
          <div>₦50,000</div>
        </div>
      </div>

      <div style={{
        backgroundColor: '#fff3cd',
        border: '2px solid #ffc107',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '0', color: '#856404' }}>
          💳 Payment Information
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Bank Details:</div>
          <div style={{ lineHeight: '1.8' }}>
            <strong>Bank:</strong> UBA<br />
            <strong>Account Number:</strong> 1018339742<br />
            <strong>Account Name:</strong> Christian Medical and Dental Association of Nigeria
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          border: '2px solid #dc3545',
          padding: '15px',
          borderRadius: '6px',
          marginTop: '15px',
        }}>
          <div style={{ fontWeight: 'bold', color: '#dc3545', marginBottom: '5px', fontSize: '16px' }}>
            ⚠️ IMPORTANT: Transfer Narration
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            When making your transfer, please add <strong style={{ color: '#dc3545' }}>"IFEHL 2025(03)"</strong> to your transfer narration/description to help us identify your payment quickly.
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8d7da',
          border: '2px solid #dc3545',
          padding: '15px',
          borderRadius: '6px',
          marginTop: '15px',
          textAlign: 'center' as const,
        }}>
          <div style={{ fontWeight: 'bold', color: '#721c24', fontSize: '16px' }}>
            ⏰ PAYMENT DEADLINE: October 31st, 2025
          </div>
          <div style={{ color: '#721c24', marginTop: '5px', fontSize: '14px' }}>
            Last Day of Collection - Please complete your payment before this date
          </div>
        </div>
      </div>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        We look forward to seeing you at the event. Please ensure you complete your payment by <strong>October 31st, 2025</strong>. If you have any questions, please don't hesitate to contact us at <strong>08091533339</strong>.
      </p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}>
        Best regards,<br />
        <span style={{ fontWeight: 'bold' }}>CMDA-IFEHL Team</span>
      </p>
    </div>
    
    <div style={{ textAlign: 'center' as const, margin: '20px 0', color: '#666', fontSize: '12px' }}>
      © {new Date().getFullYear()} Christian Medical and Dental Association of Nigeria. All rights reserved.
    </div>
  </div>
);
