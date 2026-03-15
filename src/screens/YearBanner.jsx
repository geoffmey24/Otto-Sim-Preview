import React, { useEffect, useMemo } from 'react';

const CONFETTI_COLORS = ['#f5c842', '#6fcf97', '#56ccf2', '#bc80bd', '#eb5757', '#fc8d59'];

export default function YearBanner({ year, onDismiss }) {
  const confetti = useMemo(() => {
    const items = [];
    for (let i = 0; i < 15; i++) {
      items.push({
        left: (5 + Math.random() * 90) + '%',
        top: (30 + Math.random() * 20) + '%',
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: (Math.random() * 1).toFixed(2) + 's',
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 35,
      background: 'rgba(10,15,30,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Confetti particles */}
      {confetti.map((c, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            position: 'absolute',
            left: c.left,
            top: c.top,
            background: c.color,
            animation: 'confettiFall 1.5s ease-out forwards',
            animationDelay: c.delay,
          }}
        />
      ))}

      {/* Title */}
      <h1 style={{
        fontFamily: "'Fredoka One', cursive",
        fontSize: 36,
        color: '#f5c842',
        textAlign: 'center',
        textShadow: '0 0 30px rgba(245,200,66,0.4)',
        margin: 0,
      }}>Year {year} Complete!</h1>
    </div>
  );
}
