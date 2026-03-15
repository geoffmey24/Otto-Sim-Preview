import React from 'react';

export function CoinIcon({ size = 12 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #f5c842, #e0a820)',
      border: '1px solid #d4a017',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
      position: 'relative',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: "'Nunito', sans-serif",
        fontWeight: 'bold',
        fontSize: size * 0.58,
        color: '#8a6a10',
        lineHeight: 1,
      }}>$</span>
    </div>
  );
}

export function HeartIcon({ size = 12 }) {
  return (
    <div style={{
      width: size,
      height: size * 0.92,
      position: 'relative',
      display: 'inline-block',
      flexShrink: 0,
    }}>
      <div style={{
        width: size * 0.5,
        height: size * 0.75,
        background: '#fc8d59',
        transform: 'rotate(-45deg)',
        position: 'absolute',
        top: size * 0.18,
        left: size * 0.28,
        borderRadius: 1,
      }} />
      <div style={{
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: '#fc8d59',
        position: 'absolute',
        top: size * -0.04,
        left: size * 0.28,
      }} />
      <div style={{
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: '#fc8d59',
        position: 'absolute',
        top: size * 0.18,
        left: size * 0.02,
      }} />
    </div>
  );
}

export function BrainIcon({ size = 12 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      border: '1.5px solid #bc80bd',
      background: 'transparent',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxSizing: 'border-box',
    }}>
      <div style={{
        width: size * 0.5,
        height: size * 0.67,
        borderRadius: `${size * 0.25}px 0 0 ${size * 0.25}px`,
        border: '1px solid #bc80bd',
        borderRight: 'none',
        boxSizing: 'border-box',
      }} />
    </div>
  );
}

export function PeopleIcon({ size = 12 }) {
  return (
    <div style={{
      width: size,
      height: size * 0.75,
      position: 'relative',
      flexShrink: 0,
    }}>
      <div style={{
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: '#56ccf2',
        position: 'absolute',
        left: 0,
        top: 0,
      }} />
      <div style={{
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: '50%',
        background: '#56ccf2',
        opacity: 0.7,
        position: 'absolute',
        left: size * 0.35,
        top: 0,
      }} />
      <div style={{
        width: size * 0.42,
        height: size * 0.25,
        background: '#56ccf2',
        borderRadius: `${size * 0.08}px ${size * 0.08}px 0 0`,
        position: 'absolute',
        left: size * 0.04,
        top: size * 0.5,
      }} />
      <div style={{
        width: size * 0.42,
        height: size * 0.25,
        background: '#56ccf2',
        opacity: 0.7,
        borderRadius: `${size * 0.08}px ${size * 0.08}px 0 0`,
        position: 'absolute',
        left: size * 0.39,
        top: size * 0.5,
      }} />
    </div>
  );
}

export function BoltIcon({ size = 12 }) {
  return (
    <div style={{
      width: size * 0.7,
      height: size,
      background: '#f5c842',
      display: 'inline-block',
      clipPath: 'polygon(40% 0%, 100% 0%, 55% 42%, 85% 42%, 20% 100%, 45% 52%, 15% 52%)',
      flexShrink: 0,
    }} />
  );
}

// Large variants for Game Over screen
export function CoinIconLarge() {
  return <CoinIcon size={64} />;
}

export function HeartIconLarge() {
  return (
    <div style={{
      width: 72,
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(235,87,87,0.4)',
      borderRadius: '50%',
    }}>
      <HeartIcon size={40} />
    </div>
  );
}

export function BrainIconLarge() {
  return (
    <div style={{
      width: 64,
      height: 64,
      borderRadius: '50%',
      border: '3px solid #bc80bd',
      background: 'transparent',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
    }}>
      {/* Eyes */}
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#bc80bd',
        position: 'absolute',
        top: 20,
        left: 18,
      }} />
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#bc80bd',
        position: 'absolute',
        top: 20,
        left: 38,
      }} />
      {/* Frown */}
      <div style={{
        width: 16,
        height: 8,
        borderTop: '2px solid #bc80bd',
        borderRadius: '0 0 0 0',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
      }} />
    </div>
  );
}

export function PeopleIconLarge() {
  return (
    <div style={{
      width: 72,
      height: 72,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#56ccf2',
        position: 'absolute',
        left: 4,
        top: 8,
        boxShadow: '0 4px 20px rgba(86,204,242,0.4)',
      }} />
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: '#56ccf2',
        opacity: 0.7,
        position: 'absolute',
        left: 28,
        top: 8,
        boxShadow: '0 4px 20px rgba(86,204,242,0.3)',
      }} />
    </div>
  );
}
