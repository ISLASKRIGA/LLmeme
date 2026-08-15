import React, { useState } from 'react';
import { Search, Flame, Sparkles, Filter, Play } from 'lucide-react';
import { MEME_CATALOG } from '../services/memeCatalog';
import { memeAudio } from '../services/soundEffects';

export function MemeExplorer({ onSelectMemeForChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState('all');

  const EMOTION_FILTERS = [
    { id: 'all', label: '🔥 Todos los Memes' },
    { id: 'panico', label: '😱 Pánico' },
    { id: 'victoria', label: '⚡ Victoria' },
    { id: 'confusion', label: '🧐 Confusión' },
    { id: 'sarcasmo', label: '😏 Sarcasmo' },
    { id: 'dilema', label: '🤔 Dilemas' },
    { id: 'drama', label: '🔥 Drama' },
    { id: 'elegancia', label: '🎩 Señor Fino' }
  ];

  const filteredMemes = MEME_CATALOG.filter(meme => {
    const matchesSearch = meme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          meme.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesEmotion = selectedEmotion === 'all' || meme.emotions.includes(selectedEmotion);
    return matchesSearch && matchesEmotion;
  });

  return (
    <div style={{ padding: '0 24px 40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Explorer Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(16, 20, 31, 0.9) 0%, rgba(121, 40, 202, 0.2) 100%)', border: '1px solid var(--accent-magenta)' }}>
        <h2 className="text-gradient-magenta" style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
          🏛️ Bóveda Central de Memes & Tendencias
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '650px' }}>
          Explora la colección completa de memes icónicos indexados por el motor de IA de LLMeme. Selecciona cualquiera para usarlo en el chat o personalizar sus textos.
        </p>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
          {/* Search input */}
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar meme por nombre, plantilla o palabra clave..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 42px',
                background: 'rgba(5, 8, 15, 0.7)',
                border: '1px solid var(--border-neon)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {EMOTION_FILTERS.map(ef => (
              <button
                key={ef.id}
                onClick={() => { setSelectedEmotion(ef.id); memeAudio.playPop(); }}
                style={{
                  background: selectedEmotion === ef.id ? 'var(--accent-magenta)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  border: selectedEmotion === ef.id ? '1px solid #ff007f' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {ef.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Memes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
        {filteredMemes.map(meme => (
          <div
            key={meme.id}
            className="glass-panel"
            style={{
              borderRadius: '18px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.25s ease',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <div style={{ position: 'relative', height: '220px', background: '#000', overflow: 'hidden' }}>
              <img
                src={meme.imgUrlOverride || meme.imgUrl}
                alt={meme.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                  {meme.name}
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px', fontStyle: 'italic' }}>
                  {meme.origin}
                </p>
              </div>

              <button
                onClick={() => { onSelectMemeForChat(meme); memeAudio.playWow(); }}
                className="btn-neon"
                style={{ width: '100%', justifyContent: 'center', padding: '8px', fontSize: '12px' }}
              >
                <Sparkles size={14} />
                Usar en Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
