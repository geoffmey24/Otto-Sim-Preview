import React from 'react';
import StatBar from './StatBar';
import { CoinIcon, HeartIcon, BrainIcon, PeopleIcon, BoltIcon } from './CSSIcons';
import { AVATARS } from '../constants';

export default function HUD({
  playerName, avatarIndex, year, month, actionsLeft,
  finances, health, mental, relationships,
}) {
  const avatar = AVATARS[avatarIndex] || AVATARS[0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      maxWidth: 480,
      margin: '0 auto',
      background: 'rgba(12,18,28,0.95)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      padding: '10px 16px',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
      {/* Row 1 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Left: avatar + name */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 6,
          alignItems: 'center',
        }}>
          {/* Mini CSS avatar face */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: avatar.skinTone,
            position: 'relative',
            flexShrink: 0,
            overflow: 'visible',
          }}>
            {/* Hair */}
            <div style={{
              width: 18,
              height: 6,
              borderRadius: '9px 9px 0 0',
              background: avatar.hairColor,
              position: 'absolute',
              top: -1,
              left: '50%',
              transform: 'translateX(-50%)',
            }} />
            {/* Left eye */}
            <div style={{
              width: 2,
              height: 3,
              borderRadius: '50%',
              background: '#2d1a0e',
              position: 'absolute',
              top: 10,
              left: 8,
            }} />
            {/* Right eye */}
            <div style={{
              width: 2,
              height: 3,
              borderRadius: '50%',
              background: '#2d1a0e',
              position: 'absolute',
              top: 10,
              left: 17,
            }} />
            {/* Smile */}
            <div style={{
              width: 8,
              height: 4,
              border: 'none',
              borderBottom: '1px solid #2d1a0e',
              borderRadius: '0 0 4px 4px',
              position: 'absolute',
              bottom: 7,
              left: '50%',
              transform: 'translateX(-50%)',
            }} />
          </div>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(11px, 3vw, 13px)',
            fontWeight: 700,
            color: 'white',
          }}>{playerName}</span>
        </div>

        {/* Center: year/month */}
        <span style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 'clamp(10px, 2.5vw, 12px)',
          color: '#a0aec0',
        }}>Y{year} M{month}</span>

        {/* Right: actions */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          alignItems: 'center',
        }}>
          <BoltIcon size={12} />
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 'clamp(10px, 2.5vw, 12px)',
            fontWeight: 700,
            color: '#f5c842',
          }}>{actionsLeft}</span>
        </div>
      </div>

      {/* Row 2: stat bars */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px 12px',
        marginTop: 8,
      }}>
        <StatBar icon={<CoinIcon />} label="FIN" color="#f5c842" value={finances} />
        <StatBar icon={<HeartIcon />} label="HP" color="#fc8d59" value={health} />
        <StatBar icon={<BrainIcon />} label="MNT" color="#bc80bd" value={mental} />
        <StatBar icon={<PeopleIcon />} label="SOC" color="#56ccf2" value={relationships} />
      </div>
    </div>
  );
}
