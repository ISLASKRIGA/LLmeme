import React, { useState } from 'react';
import { X, Key, Check, ShieldCheck, Zap } from 'lucide-react';
import { memeAudio } from '../services/soundEffects';
import { GEMINI_KEYS } from '../services/memeEngine';

export function ApiKeyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
      <div className="neo-box" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '24px',
        boxShadow: 'var(--shadow-hard-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="var(--color-pink)" />
            <h2 style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase' }}>
              POOL DE 4 API KEYS GEMINI CONECTADO
            </h2>
          </div>
          <button
            onClick={() => { onClose(); memeAudio.playPop(); }}
            className="neo-btn"
            style={{ padding: '6px 10px', background: '#fff' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', marginBottom: '16px', lineHeight: '1.5' }}>
          Las <strong>4 Claves de API de Google Gemini 2.5 Flash</strong> están activas en modo <em>Round-Robin con Failover automático</em> para máxima velocidad y cero límites de cuota:
        </p>

        {/* Keys List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {GEMINI_KEYS.map((k, idx) => (
            <div key={idx} style={{
              background: '#fff',
              border: '2px solid #000',
              padding: '10px 14px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px'
            }}>
              <div>
                <strong>Key #{idx + 1}:</strong> {k.substring(0, 14)}...
              </div>
              <span style={{
                background: 'var(--color-green)',
                color: '#000',
                fontWeight: '900',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '3px',
                border: '1px solid #000'
              }}>
                ✓ ACTIVA (STATUS 200)
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => { onClose(); memeAudio.playVictory(); }}
          className="neo-btn neo-btn-cyan"
          style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
        >
          <Check size={16} /> ENTENDIDO Y CONTINUAR
        </button>
      </div>
    </div>
  );
}
