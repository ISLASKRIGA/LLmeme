import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Trash2, User } from 'lucide-react';
import { MemeCard } from './MemeCard';
import { memeAudio } from '../services/soundEffects';

export function ChatWindow({ messages, isLoading, onSendMessage, onClearChat, onEditMeme }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const FUNNY_PROMPTS = [
    "cuál es la mejor banda del mundo",
    "se cayó producción un viernes a las 6pm",
    "mi ex me mandó mensaje a las 3 AM",
    "llevo 3 horas debuggeando un punto y coma",
    "¿React o Vue?",
    "mi jefe dice que lo hagamos con blockchain"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    memeAudio.playPop();
    onSendMessage(text);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: 'calc(100vh - 40px)',
      maxWidth: '950px',
      margin: '0 auto',
      padding: '20px 20px 100px 20px',
      position: 'relative'
    }}>
      {/* Header Title */}
      <div style={{ textAlign: 'center', marginBottom: '24px', marginTop: '12px' }}>
        <h1 style={{
          fontFamily: 'var(--font-main)',
          fontSize: '52px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '-1px',
          margin: 0,
          textShadow: '3px 3px 0px #000'
        }}>
          LL<span style={{ color: 'var(--color-pink)' }}>MEME</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          fontWeight: '700',
          marginTop: '6px',
          background: '#000',
          color: '#fff',
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: '4px'
        }}>
          Large language Meme Model — la M es de memes, y no miente nunca.
        </p>
      </div>

      {/* Main Container Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Empty State Banner */}
        {messages.length === 0 && (
          <div className="neo-box" style={{
            padding: '36px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto 0'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '12px' }}>
              🗿
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '8px' }}>
              Escríbele lo que sea. Te va a contestar solo con memes y GIFs graciosos.
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#555', marginBottom: '24px' }}>
              Impulsado por Google Gemini 2.5 Flash + Web Audio SFX
            </p>

            {/* Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '750px' }}>
              {FUNNY_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  className="neo-btn"
                  style={{ background: '#fff', fontSize: '12px', textTransform: 'none' }}
                  onClick={() => { memeAudio.playPop(); onSendMessage(prompt); }}
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* User Prompt Bubble */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className="neo-box" style={{
                maxWidth: '85%',
                padding: '12px 18px',
                background: '#fff',
                position: 'relative'
              }}>
                <div style={{
                  background: 'var(--bg-yellow)',
                  border: '2px solid #000',
                  fontWeight: '900',
                  fontSize: '10px',
                  padding: '2px 8px',
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '6px'
                }}>
                  <User size={12} /> TÚ PREGUNTASTE:
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: '700' }}>
                  "{msg.prompt}"
                </div>
              </div>
            </div>

            {/* Meme Card Response */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <MemeCard
                msg={msg}
                onEditMeme={onEditMeme}
              />
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', padding: '20px 0' }}>
            <div className="neo-box-cyan" style={{ padding: '12px 24px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase', fontSize: '14px' }}>
              <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <span>se esta cocinando con un meme 🍳🔥</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Ultra Clean Bottom Fixed Input Bar (Sorpresa, Roast Me, and Bottom status line removed as requested) */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '850px',
        zIndex: 100
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              className="neo-btn"
              style={{ padding: '14px', background: '#fff' }}
              title="Limpiar Conversación"
            >
              <Trash2 size={16} />
            </button>
          )}

          <div style={{ flex: 1 }}>
            <input
              type="text"
              className="neo-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Pregúntale a LLMeme... (ej: "Mi ex me mandó mensaje a las 3 AM")'
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="neo-btn neo-btn-pink"
            style={{
              padding: '14px 24px',
              fontSize: '14px',
              opacity: (!inputText.trim() || isLoading) ? 0.5 : 1,
              cursor: (!inputText.trim() || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={16} /> MANDAR
          </button>
        </form>
      </div>
    </div>
  );
}
