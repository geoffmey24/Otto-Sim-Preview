import React, { useState, useEffect } from 'react';

export default function YearBanner({ year, onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      onContinue();
    }, 2400);
    return () => clearTimeout(t);
  }, [onContinue]);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      background: '#0a0f1e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.4s ease both',
    }}>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        color: '#f5c842',
        textTransform: 'uppercase',
        letterSpacing: 3,
        marginBottom: 8,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>New Year</span>

      <h1 style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: 56,
        color: '#ffffff',
        margin: 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.6s cubic-bezier(0.32,0.72,0,1)',
      }}>Year {year}</h1>
    </div>
  );
}
