import React from 'react';

const REASONS = {
  finances: { title: 'Bankrupt', desc: 'Your finances hit zero. You could not make ends meet.' },
  health: { title: 'Burnout', desc: 'Your health collapsed. You pushed too hard without rest.' },
  mental: { title: 'Breakdown', desc: 'Your mental health hit rock bottom. The pressure was too much.' },
  relationships: { title: 'Isolated', desc: 'You lost all your connections. Nobody was left to call.' },
};

export default function GameOver({ reason, year, month, onRestart }) {
  const info = REASONS[reason] || { title: 'Game Over', desc: 'Your journey has ended.' };

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
      animation: 'fadeIn 0.6s ease both',
    }}>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 13,
        fontWeight: 700,
        color: '#eb5757',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
      }}>Game Over</span>

      <h2 style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: 36,
        color: '#ffffff',
        margin: '0 0 12px',
      }}>{info.title}</h2>

      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 15,
        color: '#a0aec0',
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: 320,
        marginBottom: 8,
      }}>{info.desc}</p>

      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 13,
        color: '#a0aec0',
        marginBottom: 40,
      }}>You survived {year > 1 ? `${year} years` : `${month} months`}</p>

      <button
        onClick={onRestart}
        style={{
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
        Try Again
      </button>
    </div>
  );
}
