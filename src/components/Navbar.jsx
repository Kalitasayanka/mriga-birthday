import React from 'react';
import { useApp } from '../context/AppContext';
import { Music, VolumeX, Sliders, Film, HeartHandshake, Sparkles, Gamepad2 } from 'lucide-react';

export default function Navbar() {
  const { activeTab, setActiveTab, isBgmPlaying, toggleBgm, setIsDirectorOpen, herName } = useApp();

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Left: K-Drama Logo / Badge */}
        <div className="brand-group" onClick={() => setActiveTab('intro')} role="button" tabIndex={0}>
          <div className="network-pill">
            <span className="network-dot"></span>
            <span className="network-text">tvN • SPECIAL</span>
          </div>
          <div className="brand-title">
            <span className="title-kor">생일 축하해</span>
            <span className="title-eng">EP. 01: For {herName || 'You'}</span>
          </div>
        </div>

        {/* Center: Episode Navigation Tabs */}
        <nav className="nav-tabs" aria-label="Episode Chapters">
          <button
            className={`nav-tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
            onClick={() => setActiveTab('intro')}
          >
            <Film size={15} />
            <span>Episode Intro</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <Sparkles size={15} />
            <span>Trope Quiz</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'game' ? 'active' : ''}`}
            onClick={() => setActiveTab('game')}
          >
            <Gamepad2 size={15} />
            <span>Mini-Game</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'confession' ? 'active' : ''}`}
            onClick={() => setActiveTab('confession')}
          >
            <HeartHandshake size={15} />
            <span>The Climax 💌</span>
          </button>
        </nav>

        {/* Right: Sound & Director Settings */}
        <div className="nav-actions">
          <button
            className={`action-btn audio-btn ${isBgmPlaying ? 'playing' : ''}`}
            onClick={toggleBgm}
            title={isBgmPlaying ? 'Pause OST Soundtrack' : 'Play Romantic K-Drama OST'}
          >
            {isBgmPlaying ? (
              <>
                <div className="equalizer-bars">
                  <span className="bar bar-1"></span>
                  <span className="bar bar-2"></span>
                  <span className="bar bar-3"></span>
                </div>
                <span className="audio-label">OST Playing</span>
              </>
            ) : (
              <>
                <VolumeX size={17} />
                <span className="audio-label">Play OST</span>
              </>
            )}
          </button>

          <button
            className="action-btn settings-btn"
            onClick={() => setIsDirectorOpen(true)}
            title="Director's Cut - Customize Names & Link"
          >
            <Sliders size={16} />
            <span className="settings-label">Customize</span>
          </button>
        </div>
      </div>
    </header>
  );
}
