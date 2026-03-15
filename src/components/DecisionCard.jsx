import React, { useState, useCallback, useRef } from 'react';

const STAT_NAMES = {
  finances: 'Finances',
  health: 'Health',
  mental: 'Mental',
  relationships: 'Social',
};

function ImpactPills({ choice }) {
  if (choice.random) {
    return (
      <span style={{
        background: 'rgba(245,200,66,0.2)',
        color: '#f5c842',
        borderRadius: 10,
        padding: '2px 7px',
        fontFamily: "'Nunito', sans-serif",
        fontSize: 11,
        fontWeight: 700,
      }}>Random</span>
    );
  }

  const pills = [];
  const impacts = choice.impacts;
  const keys = ['finances', 'health', 'mental', 'relationships'];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = impacts[key];
    if (val && val !== 0) {
      const positive = val > 0;
      pills.push(
        <span key={key} style={{
          background: positive ? 'rgba(111,207,151,0.2)' : 'rgba(235,87,87,0.2)',
          color: positive ? '#6fcf97' : '#eb5757',
          borderRadius: 10,
          padding: '2px 7px',
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: 'nowrap',
        }}>
          {positive ? '+' : ''}{val} {STAT_NAMES[key]}
        </span>
      );
    }
  }
  return pills;
}

function getButtonStyle(buttonType) {
  if (buttonType === 'recommended') {
    return {
      background: 'linear-gradient(135deg, #6fcf97, #27ae60)',
      color: '#0a1020',
      border: 'none',
      boxShadow: '0 6px 20px rgba(111,207,151,0.35)',
    };
  }
  if (buttonType === 'risky') {
    return {
      background: 'rgba(235,87,87,0.12)',
      border: '1px solid rgba(235,87,87,0.35)',
      color: '#eb5757',
    };
  }
  // alternative
  return {
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ffffff',
  };
}

export default function DecisionCard({ scenario, locationName, actionsLeft, onChoice, onClose }) {
  const [closing, setClosing] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(-1);
  const [randomResult, setRandomResult] = useState(null);
  const choiceLockedRef = useRef(false);

  const handleChoice = useCallback((choice, index) => {
    // Guard against rapid double-tap
    if (closing || choiceLockedRef.current) return;
    choiceLockedRef.current = true;
    setPressedIndex(index);

    let finalImpacts = { ...choice.impacts };

    if (choice.random) {
      const roll = Math.random();
      const won = roll > choice.random.threshold;
      finalImpacts = won ? { ...choice.random.win } : { ...choice.random.lose };
      setRandomResult(won ? 'Lucky!' : 'Unlucky...');

      setTimeout(() => {
        setClosing(true);
        setTimeout(() => {
          onChoice(finalImpacts);
          onClose();
        }, 260);
      }, 600);
      return;
    }

    setTimeout(() => {
      setClosing(true);
      setTimeout(() => {
        onChoice(finalImpacts);
        onClose();
      }, 260);
    }, 120);
  }, [closing, onChoice, onClose]);

  const actionDots = [];
  for (let i = 0; i < 4; i++) {
    const remaining = i < actionsLeft;
    actionDots.push(
      <div key={i} style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: remaining ? '#f5c842' : 'transparent',
        border: remaining ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
        boxShadow: remaining ? '0 0 4px rgba(245,200,66,0.4)' : 'none',
        boxSizing: 'border-box',
      }} />
    );
  }

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 19,
        background: 'rgba(0,0,0,0.55)',
        animation: 'fadeIn 0.3s ease',
      }} />

      {/* Card */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        maxWidth: 480,
        maxHeight: '70vh',
        overflowY: 'auto',
        margin: '0 auto',
        background: 'linear-gradient(180deg, #0f1a2e, #0a1020)',
        borderRadius: '28px 28px 0 0',
        padding: '20px 20px 36px',
        boxShadow: '0 -12px 48px rgba(0,0,0,0.6)',
        animation: closing
          ? 'slideDownCard 0.25s ease-in both'
          : 'slideUpCard 0.38s cubic-bezier(0.32,0.72,0,1) both',
      }}>
        {/* Drag handle */}
        <div style={{
          width: 44,
          height: 5,
          background: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          margin: '0 auto 16px',
        }} />

        {/* Top row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Location pill */}
          <span style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20,
            padding: '4px 12px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: '#a0aec0',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>{locationName}</span>

          {/* Action dots */}
          <div style={{ display: 'flex', gap: 4 }}>
            {actionDots}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 24,
          color: 'white',
          marginTop: 12,
          marginBottom: 6,
        }}>{scenario.title}</h3>

        {/* Body */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14,
          color: '#a0aec0',
          lineHeight: 1.6,
          marginBottom: 18,
        }}>{scenario.body}</p>

        {/* Random result flash */}
        {randomResult && (
          <div style={{
            textAlign: 'center',
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20,
            color: randomResult === 'Lucky!' ? '#6fcf97' : '#eb5757',
            marginBottom: 12,
            animation: 'fadeIn 0.2s ease',
          }}>{randomResult}</div>
        )}

        {/* Choice buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          {scenario.choices.map((choice, i) => {
            const btnStyle = getButtonStyle(choice.buttonType);
            const isPressed = pressedIndex === i;
            return (
              <button
                key={i}
                onClick={() => handleChoice(choice, i)}
                disabled={closing || choiceLockedRef.current || randomResult !== null}
                style={{
                  width: '100%',
                  minHeight: 56,
                  borderRadius: 16,
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: closing ? 'default' : 'pointer',
                  transition: 'transform 0.12s ease',
                  fontFamily: "'Fredoka One', cursive",
                  fontSize: 14,
                  transform: isPressed ? 'scale(0.97)' : 'scale(1)',
                  outline: 'none',
                  ...btnStyle,
                }}
              >
                <span style={{ textAlign: 'left', flex: 1, marginRight: 8 }}>{choice.label}</span>
                <div style={{
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
                  justifyContent: 'flex-end',
                  flexShrink: 0,
                }}>
                  <ImpactPills choice={choice} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
