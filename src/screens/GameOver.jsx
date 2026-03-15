import React from 'react';

const REASON_TEXT = {
  finances: 'You ran out of money. Without financial stability, the basics of survival became impossible.',
  health: 'Your body finally gave out. Years of neglecting your physical health caught up all at once.',
  mental: 'The weight became too heavy to carry alone. Without proper support and care you lost the strength to continue.',
  relationships: 'Complete isolation consumed you. Humans are not built to be alone — without connection everything else crumbled.',
};

const WEAKEST_LABEL = {
  finances: 'Finances',
  health: 'Health',
  mental: 'Mental',
  relationships: 'Social',
};

function FinancesIcon() {
  return (
    <div style={{
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #f5c842, #d4a017)',
      border: '3px solid #c89a10',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(245,200,66,0.3)',
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 28,
          color: '#8a6a10',
        }}>$</span>
      </div>
    </div>
  );
}

function HealthIcon() {
  return (
    <div style={{
      width: 72,
      height: 72,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 4px 20px rgba(235,87,87,0.4))',
    }}>
      <div style={{
        width: 36,
        height: 36,
        position: 'relative',
        transform: 'rotate(45deg)',
        background: '#eb5757',
      }}>
        {/* Top circle */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#eb5757',
          position: 'absolute',
          top: -18,
          left: 0,
        }} />
        {/* Left circle */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#eb5757',
          position: 'absolute',
          top: 0,
          left: -18,
        }} />
      </div>
    </div>
  );
}

function MentalIcon() {
  return (
    <div style={{
      width: 64,
      height: 64,
      borderRadius: '50%',
      background: 'linear-gradient(180deg, #c0c8d0, #a0aec0)',
      border: '2px solid #8a98a8',
      position: 'relative',
    }}>
      {/* Left eye */}
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#4a5568',
        position: 'absolute',
        top: 20,
        left: 18,
      }} />
      {/* Right eye */}
      <div style={{
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#4a5568',
        position: 'absolute',
        top: 20,
        left: 40,
      }} />
      {/* Frown */}
      <div style={{
        width: 18,
        height: 9,
        border: '2px solid #4a5568',
        borderTop: 'none',
        borderRadius: '0 0 9px 9px',
        position: 'absolute',
        bottom: 14,
        left: '50%',
        transform: 'translateX(-50%)',
      }} />
    </div>
  );
}

function RelationshipsIcon() {
  return (
    <div style={{
      width: 72,
      height: 48,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* Circle 1 */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #56ccf2, #3a9fd4)',
        border: '2px solid #2a8fc4',
        position: 'absolute',
        left: 4,
        boxShadow: '0 4px 16px rgba(86,204,242,0.3)',
      }} />
      {/* Circle 2 */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #56ccf2, #3a9fd4)',
        border: '2px solid #2a8fc4',
        position: 'absolute',
        left: 24,
        opacity: 0.7,
        boxShadow: '0 4px 16px rgba(86,204,242,0.3)',
      }} />
    </div>
  );
}

const ICONS = {
  finances: FinancesIcon,
  health: HealthIcon,
  mental: MentalIcon,
  relationships: RelationshipsIcon,
};

function getBestStat(stats) {
  const entries = [
    { name: 'Finances', value: stats.finances },
    { name: 'Health', value: stats.health },
    { name: 'Mental', value: stats.mental },
    { name: 'Social', value: stats.relationships },
  ];
  let best = entries[0];
  for (let i = 1; i < entries.length; i++) {
    if (entries[i].value > best.value) {
      best = entries[i];
    }
  }
  return best.name;
}

export default function GameOver({ reason, stats, month, year, onRetry }) {
  const reasonText = REASON_TEXT[reason] || 'Your journey has ended.';
  const Icon = ICONS[reason] || FinancesIcon;
  const finalStats = stats || { finances: 0, health: 0, mental: 0, relationships: 0 };
  const totalMonths = (year - 1) * 12 + month;
  const bestStat = getBestStat(finalStats);
  const weakestStat = WEAKEST_LABEL[reason] || 'Unknown';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'radial-gradient(ellipse at center, #1a0505, #0a0505 60%, #050505)',
      boxShadow: 'inset 0 0 120px 40px rgba(235,87,87,0.15)',
      animation: 'pulseDanger 2s infinite',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 400,
        width: '100%',
        padding: '40px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {/* Large CSS icon */}
        <div style={{
          marginBottom: 20,
          animation: 'fadeIn 1s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon />
        </div>

        {/* Game Over title */}
        <h1 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 40,
          color: '#eb5757',
          textShadow: '0 0 30px rgba(235,87,87,0.6)',
          textAlign: 'center',
          margin: '16px 0',
        }}>Game Over</h1>

        {/* Reason text */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 15,
          color: '#a0aec0',
          textAlign: 'center',
          lineHeight: 1.6,
          marginBottom: 28,
          marginTop: 0,
        }}>{reasonText}</p>

        {/* Stats card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: 18,
          marginBottom: 28,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            color: '#a0aec0',
            marginBottom: 6,
          }}>Survived: {totalMonths} month{totalMonths !== 1 ? 's' : ''}</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            color: '#a0aec0',
            marginBottom: 6,
          }}>Best stat: {bestStat}</div>
          <div style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 13,
            color: '#a0aec0',
            marginBottom: 0,
          }}>Weakest stat: {weakestStat}</div>
        </div>

        {/* Try Again button */}
        <button
          onClick={onRetry}
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20,
            color: '#eb5757',
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: 'rgba(235,87,87,0.12)',
            border: '2px solid rgba(235,87,87,0.5)',
            cursor: 'pointer',
          }}
        >
          TRY AGAIN
        </button>
      </div>
    </div>
  );
}
