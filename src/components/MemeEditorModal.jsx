import React, { useState, useEffect, useRef } from 'react';
import { X, Download } from 'lucide-react';
import { memeAudio } from '../services/soundEffects';

export function MemeEditorModal({ editingMsg, onClose }) {
  if (!editingMsg) return null;

  const [topText, setTopText] = useState(editingMsg.captions?.topText || '');
  const [bottomText, setBottomText] = useState(editingMsg.captions?.bottomText || '');
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState('#ffffff');

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = editingMsg.meme.imgUrl;

    img.onload = () => {
      canvas.width = img.width || 600;
      canvas.height = img.height || 600;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = textColor;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(4, Math.floor(fontSize / 7));
      ctx.textAlign = 'center';
      ctx.font = `900 ${fontSize}px "Impact", "Outfit", sans-serif`;

      if (topText) {
        ctx.textBaseline = 'top';
        const topY = 20;
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, topY);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, topY);
      }

      if (bottomText) {
        ctx.textBaseline = 'bottom';
        const bottomY = canvas.height - 20;
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, bottomY);
      }
    };
  }, [editingMsg, topText, bottomText, fontSize, textColor]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageURI = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `LLMeme_${editingMsg.meme.name.replace(/\s+/g, '_')}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    memeAudio.playVictory();
  };

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
        maxWidth: '820px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        boxShadow: 'var(--shadow-hard-lg)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', textTransform: 'uppercase' }}>
              🎨 CANVAS MEME EDITOR STUDIO
            </h2>
            <p style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#555' }}>
              Personaliza el texto de "{editingMsg.meme.name}"
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

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#000', border: '3px solid #000', borderRadius: '6px', padding: '8px' }}>
            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px' }}>
                TEXTO SUPERIOR (TOP):
              </label>
              <input
                type="text"
                className="neo-input"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Texto arriba..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px' }}>
                TEXTO INFERIOR (BOTTOM):
              </label>
              <input
                type="text"
                className="neo-input"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Texto abajo..."
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '6px' }}>
                TAMAÑO DE LETRA ({fontSize}px):
              </label>
              <input
                type="range"
                min="20"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#000' }}
              />
            </div>

            <button
              onClick={handleDownload}
              className="neo-btn neo-btn-cyan"
              style={{ justifyContent: 'center', padding: '12px', fontSize: '13px' }}
            >
              <Download size={16} /> DESCARGAR MEME PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
