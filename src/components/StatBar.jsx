import React, { useRef, useEffect, useState } from 'react';

export default function StatBar({ value, color, label, icon }) {
  const displayRef = useRef(value);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      displayRef.current += (value - displayRef.current) * 0.15;
      if (Math.abs(displayRef.current - value) < 0.5) {
        displayRef.current = value;
        clearInterval(id);
      }
      setTick(t => t + 1);
    }, 16);
    return () => clearInterval(id);
  }, [value]);

  const danger = value < 25;
  const displayVal = Math.round(displayRef.current);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    }}>
      {icon}
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 'clamp(8px, 2vw, 9px)',
        textTransform: 'uppercase',
        color: '#a0aec0',
        width: 28,
        flexShrink: 0,
      }}>{label}</span>
      <div style={{
        flex: 1,
        height: 7,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        minWidth: 60,
      }}>
        <div style={{
          height: '100%',
          borderRadius: 4,
          width: Math.max(0, Math.min(100, displayRef.current)) + '%',
          background: danger ? '#eb5757' : color,
          animation: danger ? 'pulseDanger 2s infinite' : 'none',
          transition: 'width 0.1s linear',
        }} />
      </div>
      {danger && (
        <span style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 8,
          fontWeight: 700,
          color: '#eb5757',
          marginLeft: 2,
          flexShrink: 0,
        }}>!</span>
      )}
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 'clamp(9px, 2vw, 10px)',
        color: '#a0aec0',
        width: 20,
        textAlign: 'right',
        flexShrink: 0,
      }}>{displayVal}</span>
    </div>
  );
}
