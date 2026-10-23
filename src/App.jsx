import React from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/useApp';
import HeroSection from './components/HeroSection';
import SweetLetters from './components/SweetLetters';
import './App.css';

// Deterministic particle data to eliminate Math.random during render
const PARTICLES = [
  { delay: '0s', x: '8%', duration: '14s', size: '4px' },
  { delay: '1.2s', x: '18%', duration: '18s', size: '3px' },
  { delay: '2.5s', x: '29%', duration: '16s', size: '5px' },
  { delay: '0.8s', x: '42%', duration: '15s', size: '3px' },
  { delay: '3.1s', x: '54%', duration: '19s', size: '4px' },
  { delay: '1.7s', x: '65%', duration: '17s', size: '5px' },
  { delay: '4.2s', x: '76%', duration: '13s', size: '3px' },
  { delay: '2.9s', x: '88%', duration: '20s', size: '4px' },
  { delay: '5.0s', x: '95%', duration: '15s', size: '3px' },
  { delay: '3.6s', x: '12%', duration: '16s', size: '4px' },
  { delay: '6.2s', x: '35%', duration: '14s', size: '5px' },
  { delay: '4.8s', x: '82%', duration: '18s', size: '3px' },
];

function MainApp() {
  const { herName, myName } = useApp();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Ambient Floating Particles */}
      <div className="particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{
              '--delay': p.delay,
              '--x': p.x,
              '--duration': p.duration,
              '--size': p.size,
            }}
          />
        ))}
      </div>

      {/* Hero 3D Birthday Greeting */}
      <main>
        <HeroSection />

        {/* Sweet Interactive Letters */}
        <SweetLetters />
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-divider" />
        <p className="footer-text">
          Handcrafted with sincere care for <strong>{herName}</strong>
        </p>
        <p className="footer-sub">
          With warmth — {myName}
        </p>
        <button
          className="btn-back-to-top"
          onClick={handleScrollToTop}
          aria-label="Back to top"
        >
          ↑ Back to top
        </button>
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
