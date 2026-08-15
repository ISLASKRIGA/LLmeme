import React, { useState } from 'react';
import { Volume2, Edit3, Copy, Check, Sparkles } from 'lucide-react';
import { memeAudio } from '../services/soundEffects';

export function MemeCard({ msg, onEditMeme }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const meme = msg.meme || {};
  const captions = msg.captions || {};

  const primaryImgUrl = meme.imgUrl || "https://i.imgflip.com/30b1gx.jpg";
  const fallbackImgUrl = "https://i.imgflip.com/30b1gx.jpg";

  const handlePlaySound = () => {
    const soundType = meme.sound || 'wow';
    if (soundType === 'bruh') memeAudio.playBruh();
    else if (soundType === 'airhorn') memeAudio.playAirhorn();
    else if (soundType === 'sadViolin') memeAudio.playSadViolin();
    else if (soundType === 'emotionalDamage') memeAudio.playEmotionalDamage();
    else if (soundType === 'victory') memeAudio.playVictory();
    else memeAudio.playWow();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(imgError ? fallbackImgUrl : primaryImgUrl);
    setCopied(true);
    memeAudio.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const isDrake = meme.name && meme.name.toLowerCase().includes('drake');

  return (
    <div className="neo-box" style={{
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto',
      padding: '16px'
    }}>
      {/* Header Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'var(--color-cyan)',
            color: '#000',
            border: '2px solid #000',
            fontWeight: '900',
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Sparkles size={12} />
            {msg.emotion || '✨ Gemini AI'}
          </span>
          <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'var(--font-mono)' }}>
            {msg.confidence || '99.9% Match'}
          </span>
        </div>

        <span style={{
          background: 'var(--bg-yellow)',
          color: '#000',
          border: '2px solid #000',
          fontSize: '11px',
          fontWeight: '900',
          padding: '2px 8px',
          borderRadius: '4px'
        }}>
          {meme.name}
        </span>
      </div>

      {/* Meme Image Container with Overlay Captions */}
      <div style={{
        position: 'relative',
        minHeight: '300px',
        borderRadius: '6px',
        border: '3px solid #000',
        background: '#111',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={imgError ? fallbackImgUrl : primaryImgUrl}
          alt={meme.name}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => {
            console.warn("Asset load interceptor active -> switching to fallback");
            setImgError(true);
          }}
          style={{
            width: '100%',
            minHeight: '280px',
            maxHeight: '480px',
            objectFit: 'contain',
            display: 'block'
          }}
        />

        {/* Impact Meme Captions Rendered Directly on Image */}
        {captions && (captions.topText || captions.bottomText) && (
          <>
            {/* Top Text / Drake Top Right Panel */}
            {captions.topText && (
              <div style={{
                position: 'absolute',
                top: isDrake ? '12%' : '10px',
                left: isDrake ? '52%' : '10px',
                right: '10px',
                textAlign: isDrake ? 'left' : 'center',
                fontSize: isDrake ? '16px' : '22px',
                fontWeight: '900',
                lineHeight: '1.2',
                color: isDrake ? '#000' : '#fff',
                fontFamily: isDrake ? 'var(--font-mono)' : 'Impact, sans-serif',
                textTransform: 'uppercase',
                textShadow: isDrake ? 'none' : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                padding: '4px 8px',
                borderRadius: '4px',
                background: isDrake ? 'rgba(255,255,255,0.85)' : 'transparent',
                pointerEvents: 'none'
              }}>
                {captions.topText}
              </div>
            )}

            {/* Bottom Text / Drake Bottom Right Panel */}
            {captions.bottomText && (
              <div style={{
                position: 'absolute',
                bottom: isDrake ? '12%' : '12px',
                left: isDrake ? '52%' : '10px',
                right: '10px',
                textAlign: isDrake ? 'left' : 'center',
                fontSize: isDrake ? '16px' : '22px',
                fontWeight: '900',
                lineHeight: '1.2',
                color: isDrake ? '#000' : '#fff',
                fontFamily: isDrake ? 'var(--font-mono)' : 'Impact, sans-serif',
                textTransform: 'uppercase',
                textShadow: isDrake ? 'none' : '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                padding: '4px 8px',
                borderRadius: '4px',
                background: isDrake ? 'rgba(255,255,255,0.85)' : 'transparent',
                pointerEvents: 'none'
              }}>
                {captions.bottomText}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '14px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handlePlaySound} className="neo-btn neo-btn-cyan" style={{ padding: '6px 12px', fontSize: '11px' }}>
            <Volume2 size={14} /> SFX AUDIO
          </button>

          <button
            onClick={() => {
              onEditMeme(msg);
              memeAudio.playPop();
            }}
            className="neo-btn neo-btn-pink"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            <Edit3 size={14} /> EDITAR
          </button>
        </div>

        <button onClick={handleCopyLink} className="neo-btn" style={{ padding: '6px 10px', fontSize: '11px', background: copied ? 'var(--color-green)' : '#fff' }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'COPIADO' : 'COPIAR'}
        </button>
      </div>
    </div>
  );
}
