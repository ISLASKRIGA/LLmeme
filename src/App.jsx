import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatWindow } from './components/ChatWindow';
import { MemeEditorModal } from './components/MemeEditorModal';
import { SoundboardModal } from './components/SoundboardModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { queryLLMeme, clearSessionMemory } from './services/memeEngine';
import { memeAudio } from './services/soundEffects';

export function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('AIzaSyBWVUuVWh3GvU-tXO0EfD7NWo9J2yqOa2Y');

  // Modals state
  const [editingMsg, setEditingMsg] = useState(null);
  const [soundboardOpen, setSoundboardOpen] = useState(false);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  // Messages list
  const [messages, setMessages] = useState([]);

  // Send message using Gemini AI
  const handleSendMessage = async (promptText) => {
    setIsLoading(true);
    try {
      const memeResponse = await queryLLMeme(promptText, apiKey);
      setMessages(prev => [...prev, memeResponse]);

      // Play sound
      const firstSound = memeResponse.meme?.sound || 'wow';
      if (firstSound === 'bruh') memeAudio.playBruh();
      else if (firstSound === 'airhorn') memeAudio.playAirhorn();
      else if (firstSound === 'sadViolin') memeAudio.playSadViolin();
      else if (firstSound === 'emotionalDamage') memeAudio.playEmotionalDamage();
      else if (firstSound === 'victory') memeAudio.playVictory();
      else memeAudio.playWow();

    } catch (err) {
      console.error("Error generating Gemini AI meme response:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Regenerate memes
  const handleRegenerateMemes = async (targetMsg) => {
    setIsLoading(true);
    try {
      const newResponse = await queryLLMeme(targetMsg.prompt, apiKey);
      setMessages(prev => prev.map(m => m.id === targetMsg.id ? newResponse : m));
      memeAudio.playVictory();
    } catch (err) {
      console.error("Error regenerating memes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    clearSessionMemory();
    memeAudio.playPop();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenSoundboard={() => setSoundboardOpen(true)}
        onOpenApiKey={() => setApiKeyOpen(true)}
      />

      {/* Main View */}
      <main style={{ flex: 1 }}>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClearChat={handleClearChat}
          onEditMeme={(msg) => setEditingMsg(msg)}
          onRegenerateMemes={handleRegenerateMemes}
        />
      </main>

      {/* Canvas Meme Editor Modal */}
      <MemeEditorModal
        editingMsg={editingMsg}
        onClose={() => setEditingMsg(null)}
      />

      {/* Meme Soundboard Modal */}
      <SoundboardModal
        isOpen={soundboardOpen}
        onClose={() => setSoundboardOpen(false)}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyOpen}
        onClose={() => setApiKeyOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
    </div>
  );
}

export default App;
