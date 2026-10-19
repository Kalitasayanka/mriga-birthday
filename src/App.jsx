import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import CherryBlossoms from './components/CherryBlossoms';
import HeroEpisodeIntro from './components/HeroEpisodeIntro';
import TropeQuiz from './components/TropeQuiz';
import MiniGame from './components/MiniGame';
import ConfessionScene from './components/ConfessionScene';
import DirectorModal from './components/DirectorModal';
import KdramaSoundtrackPlayer from './components/KdramaSoundtrackPlayer';
import './App.css';

function MainApp() {
  const { activeTab, herName, myName } = useApp();

  return (
    <div className="app-layout">
      {/* Dynamic Floating Cherry Blossom Canvas */}
      <CherryBlossoms />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Episode Presentation */}
      <main className="main-content">
        {activeTab === 'intro' && <HeroEpisodeIntro />}
        {activeTab === 'quiz' && <TropeQuiz />}
        {activeTab === 'game' && <MiniGame />}
        {activeTab === 'confession' && <ConfessionScene />}
      </main>

      {/* Floating OST Player */}
      <KdramaSoundtrackPlayer />

      {/* Personalization Director Modal */}
      <DirectorModal />

      {/* Footer */}
      <footer className="k-footer">
        <div className="footer-inner">
          <p className="footer-line-1">
            🌸 A Special Birthday Production for <strong>{herName}</strong>
          </p>
          <p className="footer-line-2">
            Written & Directed with care by <strong>{myName}</strong> • Happy Birthday!
          </p>
          <span className="footer-korean">당신의 모든 날이 드라마처럼 빛나기를 바라요 ✨</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
