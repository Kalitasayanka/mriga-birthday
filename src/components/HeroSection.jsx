import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/useApp';
import confetti from 'canvas-confetti';
import BirthdayScene from './BirthdayScene';
import { playSparkleChime, playBlowSound, toggleBackgroundMusic, playPop } from '../utils/audio';

export default function HeroSection() {
  const {
    herName,
    candlesLit,
    setCandlesLit,
    wished,
    setWished,
    isMusicPlaying,
    setIsMusicPlaying,
  } = useApp();

  const [visible, setVisible] = useState(false);
  const [sparked, setSparked] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);
  const isSwipingTrack = useRef(false);
  const trackRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleCelebrate = () => {
    if (sparked) return;
    setSparked(true);
    playSparkleChime();

    // Multi-stage confetti celebration
    const fire = (opts) =>
      confetti({
        ...opts,
        colors: ['#e8a87c', '#e07a8e', '#c9b1ff', '#7ec8e3', '#8fd9a8', '#ffd166', '#f7c59f'],
      });

    fire({ particleCount: 90, spread: 75, origin: { y: 0.65, x: 0.5 } });
    setTimeout(() => fire({ particleCount: 60, spread: 90, origin: { y: 0.7, x: 0.25 } }), 220);
    setTimeout(() => fire({ particleCount: 60, spread: 90, origin: { y: 0.7, x: 0.75 } }), 440);

    setTimeout(() => setSparked(false), 2600);
  };

  const handleBlowCandles = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setWished(true);
      setSwipeProgress(1);
      playBlowSound();

      // Confetti burst for making a wish
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#ffd166', '#fff1c5', '#e8a87c', '#c9b1ff'],
      });
    } else {
      // Relight
      setCandlesLit(true);
      setSwipeProgress(0);
      playSparkleChime();
    }
  };

  const handleTrackTouchStart = (e) => {
    if (!candlesLit) return;
    isSwipingTrack.current = true;
    updateSwipeProgress(e.touches[0].clientX);
  };

  const handleTrackTouchMove = (e) => {
    if (!isSwipingTrack.current || !candlesLit) return;
    updateSwipeProgress(e.touches[0].clientX);
  };

  const updateSwipeProgress = (clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const progress = Math.max(0, Math.min(1, x / rect.width));
    setSwipeProgress(progress);

    if (progress > 0.78 && candlesLit) {
      isSwipingTrack.current = false;
      handleBlowCandles();
    }
  };

  const handleTrackTouchEnd = () => {
    isSwipingTrack.current = false;
    if (candlesLit && swipeProgress < 0.78) {
      setSwipeProgress(0);
    }
  };

  const handleToggleMusic = () => {
    playPop();
    toggleBackgroundMusic((playing) => {
      setIsMusicPlaying(playing);
    });
  };

  const scrollToNext = () => {
    const lettersEl = document.getElementById('letters');
    if (lettersEl) {
      lettersEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero position-relative overflow-hidden" id="hero">
      {/* 3D Scene Background Canvas */}
      <div className="hero-scene">
        <BirthdayScene />
      </div>

      {/* Floating Hero Content Overlay */}
      <div className="container position-relative z-2">
        <div className={`hero-content mx-auto ${visible ? 'visible' : ''}`}>
          <div className="hero-badge badge rounded-pill mb-3">
            <span className="badge-dot me-2" />
            <span>✨ Today is all about you ✨</span>
          </div>

          <h1 className="hero-title serif">
            Happy Birthday,<br />
            <span className="hero-name">{herName}</span>
          </h1>

          <p className="hero-subtitle mx-auto">
            A little celebration handcrafted just for you — wishing you all the joy, good health, great memories, and smiles today.
          </p>

          {/* Interactive Swipe Track for Candles on Phone */}
          <div className="swipe-candle-box mb-3">
            <div
              ref={trackRef}
              className={`swipe-track ${!candlesLit ? 'completed' : ''}`}
              onTouchStart={handleTrackTouchStart}
              onTouchMove={handleTrackTouchMove}
              onTouchEnd={handleTrackTouchEnd}
              onClick={handleBlowCandles}
              role="button"
              tabIndex={0}
            >
              <div
                className="swipe-thumb"
                style={{
                  left: candlesLit ? `calc(${swipeProgress * 80}% + 4px)` : 'calc(100% - 44px)',
                }}
              >
                {candlesLit ? '🕯️' : '✨'}
              </div>
              <span className="swipe-track-text">
                {candlesLit
                  ? '👉 Swipe to blow candles & make a wish'
                  : '✨ Candles blown! Tap to relight'}
              </span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="hero-actions d-flex flex-column gap-2 w-100">
            <button
              className="btn btn-gradient-celebrate rounded-pill py-3 px-4 w-100 shadow"
              onClick={handleCelebrate}
            >
              🎉 {sparked ? 'Woohoo! 🌟' : 'Celebrate!'}
            </button>

            <button
              className={`btn btn-music rounded-pill py-2 px-3 w-100 ${
                isMusicPlaying ? 'active' : ''
              }`}
              onClick={handleToggleMusic}
              aria-label="Toggle ambient music"
            >
              {isMusicPlaying ? '🎵 Ambient Melody: On' : '🔇 Play Music Box'}
            </button>
          </div>

          {/* Wish Granted Banner */}
          {wished && !candlesLit && (
            <div className="wish-banner animate-in mt-3 p-3 rounded">
              <span className="wish-emoji me-2">🌟</span>
              <div className="wish-message">
                <strong className="wish-title">A birthday wish for you:</strong>
                <p className="wish-text mb-0 small fst-italic">
                  May all your dreams, quiet goals, and the best memories find their way to you this year.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Down Hint */}
        <button
          className="scroll-indicator btn text-decoration-none mx-auto d-flex flex-column align-items-center mt-3"
          onClick={scrollToNext}
          aria-label="Scroll to letters"
        >
          <span className="scroll-hint-text">Swipe down to your letters</span>
          <div className="scroll-arrow-icon mt-1">↓</div>
        </button>
      </div>
    </section>
  );
}
