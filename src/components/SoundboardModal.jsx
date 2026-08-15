import React from 'react';
import { X, Volume2 } from 'lucide-react';
import { memeAudio } from '../services/soundEffects';

export function SoundboardModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const SOUND_BUTTONS = [
    { name: "📣 AIRHORN MLG", icon: "📣", action: () => memeAudio.playAirhorn(), bg: "var(--color-cyan)" },
    { name: "🗿 BRUH BASS DROP", icon: "🗿", action: () => memeAudio.playBruh(), bg: "var(--color-purple)", color: "#fff" },
    { name: "🎻 SAD VIOLIN", icon: "🎻", action: () => memeAudio.playSadViolin(), bg: "var(--color-pink)", color: "#fff" },
    { name: "💥 EMOTIONAL DAMAGE", icon: "💥", action: () => memeAudio.playEmotionalDamage(), bg: "var(--bg-yellow)" },
    { name: "😲 WOW OWEN WILSON", icon: "😲", action: () => memeAudio.playWow(), bg: "var(--color-green)" },
    { name: "🏆 VICTORY LEVEL UP", icon: "🏆", action: () => memeAudio.playVictory(), bg: "var(--color-cyan)" },
    { name: "🎈 POP BUBBLE", icon: "🎈", action: () => memeAudio.playPop(), bg: "#fff" }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="neo-box-cyan" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '24px',
        boxShadow: 'var(--shadow-hard-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase' }}>
              🔊 MEME SOUNDBOARD STUDIO
            </h2>
            <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              Efectos de sonido en tiempo real Web Audio FX
            </p>
          </div>
          <button
            onClick={() => { onClose(); memeAudio.playPop(); }}
            className="neo-btn"
            style={{ padding: '6px 10px', background: '#fff' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Buttons Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px' }}>
          {SOUND_BUTTONS.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              className="neo-btn"
              style={{
                background: btn.bg,
                color: btn.color || '#000',
                padding: '16px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <span style={{ fontSize: '32px' }}>{btn.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: '900', textAlign: 'center' }}>
                {btn.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
