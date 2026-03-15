import React, { useState, useMemo, useRef } from 'react';
import { AVATARS, STARTING_STATS } from '../constants';

export default function CharacterCreation({ onStart }) {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [fading, setFading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);

  const stars = useMemo(() => {
    const result = [];
    for (let i = 0; i < 40; i++) {
      result.push({
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
    return result;
  }, []);

  const isValid = playerName.trim().length > 0 && selectedAvatar !== null;

  const handleStart = () => {
    if (!isValid) {
      if (playerName.trim().length === 0) {
        setShaking(true);
        setTimeout(() => setShaking(false), 400);
      }
      return;
    }
    setFading(true);
    setTimeout(() => {
      onStart({ name: playerName.trim(), avatarIndex: selectedAvatar });
    }, 500);
  };

  const avatarLabels = ['A1', 'A2', 'A3', 'A4'];

  const statBadges = [
    { label: 'Finances ' + STARTING_STATS.finances + '%', bg: 'rgba(245,200,66,0.2)', color: '#f5c842' },
    { label: 'Health ' + STARTING_STATS.health + '%', bg: 'rgba(252,141,89,0.2)', color: '#fc8d59' },
    { label: 'Mental ' + STARTING_STATS.mental + '%', bg: 'rgba(188,128,189,0.2)', color: '#bc80bd' },
    { label: 'Social ' + STARTING_STATS.relationships + '%', bg: 'rgba(86,204,242,0.2)', color: '#56ccf2' },
  ];

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'linear-gradient(160deg, #0a0f1e 0%, #1a2744 60%, #0d1f3c 100%)',
    }}>
      {/* Star field */}
      {stars.map((star, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 2,
          height: 2,
          borderRadius: '50%',
          background: 'white',
          opacity: star.opacity,
          top: star.top,
          left: star.left,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Ambient glow */}
      <div style={{
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,200,66,0.08), transparent 70%)',
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px',
        maxWidth: 480,
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Game title */}
        <div style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 64,
          color: '#f5c842',
          textShadow: '0 0 40px rgba(245,200,66,0.5), 0 0 80px rgba(245,200,66,0.2)',
          textAlign: 'center',
          marginBottom: 4,
        }}>
          OTTO
        </div>

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 18,
          fontWeight: 400,
          color: '#a0aec0',
          letterSpacing: 4,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 40,
        }}>
          Game of Life
        </div>

        {/* Section label */}
        <div style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: '#a0aec0',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginBottom: 12,
        }}>
          Choose Your Character
        </div>

        {/* Avatar selection */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          marginBottom: 28,
        }}>
          {AVATARS.map((avatar, i) => {
            const isSelected = selectedAvatar === i;
            return (
              <div
                key={i}
                onClick={() => setSelectedAvatar(i)}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.07)',
                  border: isSelected ? '2px solid #f5c842' : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: isSelected ? '0 0 20px rgba(245,200,66,0.3)' : 'none',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {/* Face */}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  position: 'relative',
                  overflow: 'visible',
                  background: avatar.skinTone,
                }}>
                  {/* Hair */}
                  <div style={{
                    width: 28,
                    height: 10,
                    borderRadius: '14px 14px 0 0',
                    position: 'absolute',
                    top: -2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: avatar.hairColor,
                  }} />
                  {/* Left eye */}
                  <div style={{
                    position: 'absolute',
                    width: 4,
                    height: 5,
                    borderRadius: '50%',
                    background: '#2d1a0e',
                    top: 15,
                    left: 11,
                  }} />
                  {/* Right eye */}
                  <div style={{
                    position: 'absolute',
                    width: 4,
                    height: 5,
                    borderRadius: '50%',
                    background: '#2d1a0e',
                    top: 15,
                    left: 25,
                  }} />
                  {/* Smile */}
                  <div style={{
                    width: 12,
                    height: 6,
                    border: 'none',
                    borderBottom: '2px solid #2d1a0e',
                    borderRadius: '0 0 6px 6px',
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }} />
                </div>
                {/* Label */}
                <span style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#a0aec0',
                  marginTop: 4,
                }}>
                  {avatarLabels[i]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Name input label */}
        <div style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: '#a0aec0',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginBottom: 8,
          alignSelf: 'flex-start',
        }}>
          Your Name
        </div>

        {/* Name input */}
        <input
          ref={inputRef}
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          maxLength={20}
          placeholder="Enter your name"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: inputFocused ? 'rgba(245,200,66,0.05)' : 'rgba(255,255,255,0.06)',
            border: inputFocused ? '1px solid #f5c842' : '1px solid rgba(255,255,255,0.15)',
            borderRadius: 14,
            padding: '14px 18px',
            color: '#ffffff',
            fontFamily: "'Nunito', sans-serif",
            fontSize: 16,
            outline: 'none',
            boxShadow: inputFocused ? '0 0 0 3px rgba(245,200,66,0.1)' : 'none',
            marginBottom: 24,
            animation: shaking ? 'shakeField 0.4s ease' : 'none',
          }}
        />

        {/* Starting scenario card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18,
          padding: 20,
          marginBottom: 28,
          width: '100%',
        }}>
          {/* Graduation cap icon - CSS only */}
          <div style={{
            width: 40,
            height: 30,
            position: 'relative',
            margin: '0 auto 12px',
          }}>
            {/* Tassel ball */}
            <div style={{
              width: 4,
              height: 4,
              background: '#e0a820',
              borderRadius: '50%',
              position: 'absolute',
              top: -2,
              right: 3,
            }} />
            {/* Tassel cord */}
            <div style={{
              width: 2,
              height: 10,
              background: '#e0a820',
              position: 'absolute',
              top: 0,
              right: 4,
              borderRadius: 1,
            }} />
            {/* Mortarboard top */}
            <div style={{
              width: 36,
              height: 6,
              background: '#f5c842',
              borderRadius: 2,
              position: 'absolute',
              top: 4,
              left: '50%',
              transform: 'translateX(-50%) rotate(-2deg)',
            }} />
            {/* Cap body */}
            <div style={{
              width: 18,
              height: 14,
              background: '#f5c842',
              clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)',
              position: 'absolute',
              top: 9,
              left: '50%',
              transform: 'translateX(-50%)',
            }} />
          </div>

          {/* Title */}
          <div style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 22,
            color: 'white',
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Fresh Start
          </div>

          {/* Description */}
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            color: '#a0aec0',
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: 14,
          }}>
            You just graduated high school. No savings, no job, no credit history. You have $200 to your name and a whole life ahead of you.
          </div>

          {/* Stat badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 6,
          }}>
            {statBadges.map((badge, i) => (
              <span key={i} style={{
                borderRadius: 20,
                padding: '4px 10px',
                fontFamily: "'Nunito', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                background: badge.bg,
                color: badge.color,
              }}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20,
            color: '#0a0f1e',
            width: '100%',
            height: 58,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #f5c842, #e0a820)',
            border: 'none',
            boxShadow: isValid && hovered
              ? '0 12px 32px rgba(245,200,66,0.5)'
              : '0 8px 24px rgba(245,200,66,0.4)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            opacity: isValid ? 1 : 0.4,
            transform: isValid && hovered ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          START YOUR LIFE
        </button>
      </div>

      {/* Fade to black overlay */}
      {fading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#0a0f1e',
          zIndex: 999,
          animation: 'fadeToBlack 0.5s ease forwards',
        }} />
      )}
    </div>
  );
}
