import React from 'react';

interface InvalidQrScreenProps {
  message?: string;
}

const InvalidQrScreen: React.FC<InvalidQrScreenProps> = ({
  message = 'This QR code is not valid, please ask staff for help.',
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #1a0d0b 0%, #3a1712 45%, #f4e7d8 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          borderRadius: '24px',
          background: '#fffaf3',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.24)',
          border: '1px solid rgba(122, 54, 38, 0.16)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            margin: '0 auto 20px',
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(122, 54, 38, 0.12)',
            color: '#7a3626',
            fontSize: '32px',
            fontWeight: 700,
          }}
        >
          !
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: '28px', color: '#3b1a14' }}>Invalid QR Code</h1>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#5f473f' }}>{message}</p>
      </div>
    </div>
  );
};

export default InvalidQrScreen;