import * as React from 'react';

interface ReminderEmailProps {
  firstName: string;
  registrationId: string;
}

export const ReminderEmail: React.FC<ReminderEmailProps> = ({
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
    <div style={{
      backgroundColor: '#f5a623',
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
        Registration Reminder - IFEHL(02) 2025
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
        This is a friendly reminder regarding your registration (ID: <span style={{ fontWeight: 'bold', color: '#f5a623' }}>{registrationId}</span>) for IFEHL 2025.
      </p>
      
      <div style={{
        backgroundColor: '#fff9e6',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #f5e0b3',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '0', color: '#f5a623' }}>
          Important: Complete Your Registration
        </h2>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          To complete your registration, please ensure you have made the payment of ₦50,000 to the following account:
        </p>
        
        <div style={{
          backgroundColor: 'white',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #f5e0b3',
        }}>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Account Details:</div>
            <div style={{ paddingLeft: '10px' }}>Account Name: Christian Medical and Dental Association of Nigeria</div>
            <div style={{ paddingLeft: '10px' }}>Account Number: 1018339742</div>
            <div style={{ paddingLeft: '10px' }}>Bank: UBA</div>
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '0', color: '#666' }}>
          Event Details
        </h2>
        
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ minWidth: '100px', fontWeight: 'bold' }}>Date:</div>
          <div>7-14th June, 2025</div>
        </div>
        
        <div style={{ display: 'flex', marginBottom: '10px' }}>
          <div style={{ minWidth: '100px', fontWeight: 'bold' }}>Venue:</div>
          <div>RIMAD #5 Robert Institute Street (RIMAD), Satellite Town, Calabar, Nigeria</div>
        </div>
      </div>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
        If you have already made the payment, please disregard this reminder.
      </p>
      
      <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}>
        Best regards,<br />
        <span style={{ fontWeight: 'bold' }}>CMDA Team</span>
      </p>
    </div>
    
    <div style={{ textAlign: 'center' as const, margin: '20px 0', color: '#666', fontSize: '12px' }}>
      © {new Date().getFullYear()} Christian Medical and Dental Association of Nigeria. All rights reserved.
    </div>
  </div>
);
