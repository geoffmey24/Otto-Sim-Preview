import React from 'react';

const STAT_CONFIG = [
  { key: 'finances', label: 'Finances', color: '#f5c842' },
  { key: 'health', label: 'Health', color: '#fc8d59' },
  { key: 'mental', label: 'Mental', color: '#bc80bd' },
  { key: 'relationships', label: 'Social', color: '#56ccf2' },
];

const SENTENCES = {
  finances: {
    positive: 'A good month for your wallet.',
    negative: 'Money was tight this month.',
  },
  health: {
    positive: 'You took care of your body — it shows.',
    negative: 'Your health took a hit.',
  },
  mental: {
    positive: 'Your mind feels clearer than it has in weeks.',
    negative: 'The mental load is piling up.',
  },
  relationships: {
    positive: 'The people around you made this month better.',
    negative: 'You are starting to feel disconnected.',
  },
};

function UpArrow() {
  return (
    <div style={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderBottom: '6px solid #6fcf97',
      display: 'inline-block',
    }} />
  );
}

function DownArrow() {
  return (
    <div style={{
      width: 0,
      height: 0,
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      borderTop: '6px solid #eb5757',
      display: 'inline-block',
    }} />
  );
}

function getSummary(stats, previousStats) {
  let biggestKey = 'finances';
  let biggestAbs = 0;
  for (let i = 0; i < STAT_CONFIG.length; i++) {
    const k = STAT_CONFIG[i].key;
    const d = Math.abs(stats[k] - previousStats[k]);
    if (d > biggestAbs) {
      biggestAbs = d;
      biggestKey = k;
    }
  }
  if (biggestAbs === 0) return 'A quiet month. Nothing much changed.';
  const delta = stats[biggestKey] - previousStats[biggestKey];
  return SENTENCES[biggestKey][delta > 0 ? 'positive' : 'negative'];
}

export default function MonthSummary({ stats, previousStats, month, year, onNextMonth }) {
  const prev = previousStats || stats;
  const summary = getSummary(stats, prev);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 30,
      background: 'linear-gradient(180deg, rgba(10,15,30,0.97), rgba(15,25,45,0.97))',
      animation: 'fadeIn 0.4s ease',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      overflow: 'auto',
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        margin: '0 auto',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {/* Title */}
        <h2 style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 30,
          color: '#f5c842',
          textAlign: 'center',
          marginTop: 0,
          marginBottom: 24,
        }}>Month {month} Complete</h2>

        {/* Stat change cards */}
        {STAT_CONFIG.map((sc, idx) => {
          const oldVal = prev[sc.key];
          const newVal = stats[sc.key];
          const delta = newVal - oldVal;
          const increased = delta > 0;
          const decreased = delta < 0;
          const delays = [0.1, 0.25, 0.4, 0.55];

          return (
            <div
              key={sc.key}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14,
                padding: '14px 18px',
                marginBottom: 8,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                animation: 'staggerFadeIn 0.4s ease both',
                animationDelay: `${delays[idx]}s`,
                boxSizing: 'border-box',
              }}
            >
              {/* Stat name */}
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: sc.color,
                width: 70,
                flexShrink: 0,
              }}>{sc.label}</span>

              {/* Center: old → arrow → new */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                flex: 1,
              }}>
                <span style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13,
                  color: '#a0aec0',
                }}>{oldVal}</span>

                {increased && <UpArrow />}
                {decreased && <DownArrow />}
                {!increased && !decreased && (
                  <span style={{
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: 13,
                    color: '#a0aec0',
                  }}>—</span>
                )}

                <span style={{
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: increased ? '#6fcf97' : decreased ? '#eb5757' : '#a0aec0',
                }}>{newVal}</span>
              </div>

              {/* Delta pill */}
              {delta !== 0 && (
                <span style={{
                  background: increased ? 'rgba(111,207,151,0.2)' : 'rgba(235,87,87,0.2)',
                  color: increased ? '#6fcf97' : '#eb5757',
                  borderRadius: 10,
                  padding: '2px 8px',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>{increased ? '+' : ''}{delta}</span>
              )}
            </div>
          );
        })}

        {/* Summary sentence */}
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 14,
          fontStyle: 'italic',
          color: '#a0aec0',
          textAlign: 'center',
          margin: '20px 0',
          lineHeight: 1.5,
          animation: 'staggerFadeIn 0.4s ease both',
          animationDelay: '0.7s',
        }}>{summary}</p>

        {/* Next Month button */}
        <button
          onClick={onNextMonth}
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 20,
            color: '#0a0f1e',
            width: '100%',
            height: 54,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #f5c842, #e0a820)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(245,200,66,0.35)',
            animation: 'staggerFadeIn 0.4s ease both',
            animationDelay: '0.85s',
          }}
        >
          Next Month
        </button>
      </div>
    </div>
  );
}
