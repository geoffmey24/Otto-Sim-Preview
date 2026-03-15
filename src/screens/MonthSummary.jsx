import React, { useState } from 'react';

export default function MonthSummary({ finances, health, mental, relationships, month, year, onContinue }) {
  const [exiting, setExiting] = useState(false);

  const stats = [
    { label: 'Finances', value: finances, color: '#f5c842' },
    { label: 'Health', value: health, color: '#fc8d59' },
    { label: 'Mental', value: mental, color: '#56ccf2' },
    { label: 'Social', value: relationships, color: '#bc80bd' },
  ];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleContinue = () => {
    setExiting(true);
    setTimeout(() => {
      onContinue();
    }, 300);
  };

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      boxSizing: 'border-box',
      animation: exiting ? 'fadeToBlack 0.3s ease both' : 'fadeIn 0.4s ease both',
    }}>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        color: '#a0aec0',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 8,
      }}>Month Summary</span>

      <h2 style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: 32,
        color: '#ffffff',
        margin: '0 0 4px',
      }}>{monthNames[(month - 1) || 0]} Year {year}</h2>

      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 14,
        color: '#a0aec0',
        marginBottom: 32,
      }}>Here is how you are doing</p>

      <div style={{
        width: '100%',
        maxWidth: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: s.color,
              width: 72,
              textAlign: 'right',
            }}>{s.label}</span>
            <div style={{
              flex: 1,
              height: 12,
              background: 'rgba(255,255,255,0.08)',
              borderRadius: 6,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${s.value}%`,
                height: '100%',
                background: s.color,
                borderRadius: 6,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: '#ffffff',
              width: 32,
            }}>{s.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleContinue}
        style={{
          marginTop: 40,
          padding: '14px 48px',
          borderRadius: 16,
          border: 'none',
          background: 'linear-gradient(135deg, #6fcf97, #27ae60)',
          color: '#0a1020',
          fontFamily: "'Fredoka One', cursive",
          fontSize: 16,
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(111,207,151,0.35)',
        }}
      >
        Continue
      </button>
    </div>
  );
}
