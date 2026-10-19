import React from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { Play, Sparkles, Heart, Flame, Gift, Star, Award, ChevronRight } from 'lucide-react';

export default function HeroEpisodeIntro() {
  const {
    herName,
    myName,
    setActiveTab,
    cakeBlown,
    setCakeBlown,
    candleLit,
    setCandleLit,
    isBgmPlaying,
    toggleBgm
  } = useApp();

  const handleBlowCandle = () => {
    if (!candleLit) {
      // Re-light
      setCandleLit(true);
      setCakeBlown(false);
      soundEngine.playChime();
      return;
    }

    setCandleLit(false);
    setCakeBlown(true);
    soundEngine.playFanfare();

    // Trigger gorgeous multi-colored confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff758f', '#ffb3c1', '#ffd166', '#c77dff', '#70d6ff']
    });

    // Start BGM if not already playing for atmosphere
    if (!isBgmPlaying) {
      toggleBgm();
    }
  };

  return (
    <section className="hero-section">
      {/* Top Banner: Cinematic Streaming Hero Card */}
      <div className="hero-poster-card glass-panel">
        <div className="poster-media-container">
          <img
            src="/assets/kdrama_poster.jpg"
            alt="Romantic K-Drama Poster"
            className="poster-image"
          />
          <div className="poster-overlay-gradient"></div>

          {/* Top Drama Badges */}
          <div className="poster-tags">
            <span className="drama-tag primary">★ TOP 1 BIRTHDAY SPECIAL</span>
            <span className="drama-tag">Rom-Com</span>
            <span className="drama-tag">Butterflies</span>
            <span className="drama-tag">No Pressure 🌸</span>
          </div>

          {/* Floating Han River / Cherry Blossom Stamp */}
          <div className="hangul-stamp">
            <span className="stamp-kor">생일 축하</span>
            <span className="stamp-sub">LIMITED PREMIERE</span>
          </div>
        </div>

        {/* Hero Narrative Info */}
        <div className="hero-content">
          <div className="korean-script-header">
            <span className="series-season">SEASON 2026 • EPISODE 1</span>
            <h1 className="hero-main-title serif-title">
              The K-Drama of <span className="text-gradient-pink">{herName}</span>
            </h1>
            <p className="korean-subtitle-line">
              "어쩌면 오늘부터, 우리 이야기의 첫 페이지" 
              <span className="sub-trans"> (Maybe today is page one of our special story)</span>
            </p>
          </div>

          {/* Cast Card */}
          <div className="cast-capsule-row">
            <div className="cast-badge">
              <span className="cast-role">👑 Main Character</span>
              <strong className="cast-name">{herName}</strong>
            </div>
            <div className="cast-badge">
              <span className="cast-role">🎬 Directed With Care</span>
              <strong className="cast-name">{myName}</strong>
            </div>
            <div className="cast-badge rating">
              <Star size={14} className="star-icon" />
              <span>10.0 / 10 Vibe</span>
            </div>
          </div>

          <p className="hero-synopsis">
            In every iconic K-drama, there is a pivotal moment when the music swells, the slow-motion
            kicks in, and someone realizes how truly special the person in front of them is. Today is
            officially your birthday, and this interactive episode was crafted just to make you smile,
            get to know you better, and share a sweet confession.
          </p>

          {/* Main Action CTAs */}
          <div className="hero-buttons-row">
            <button
              className="btn-primary"
              onClick={() => {
                soundEngine.playChime();
                if (!isBgmPlaying) toggleBgm();
                setActiveTab('quiz');
              }}
            >
              <Play size={18} fill="currentColor" />
              <span>Start Interactive Episode</span>
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                soundEngine.playChime();
                setActiveTab('confession');
              }}
            >
              <Heart size={18} className="heart-icon-btn" />
              <span>Skip to The Climax 💌</span>
            </button>
          </div>
        </div>
      </div>

      {/* Birthday Celebration Interactive Station */}
      <div className="birthday-candle-station glass-panel">
        <div className="station-header">
          <div className="sparkle-icon-wrap">
            <Sparkles size={20} className="sparkle-spin" />
          </div>
          <div>
            <h2 className="station-title">The Virtual Birthday Wish</h2>
            <p className="station-desc">Tap the candle below to make your birthday wish!</p>
          </div>
        </div>

        <div className="cake-interactive-box">
          <div className="cake-display">
            <div className={`candle-wrap ${candleLit ? 'lit' : 'blown'}`}>
              <div className="flame-glow"></div>
              <div className="flame"></div>
              <div className="smoke-puff"></div>
              <div className="candle-stick"></div>
            </div>

            <div className="cake-preview-img-wrap">
              <img
                src="/assets/kdrama_bday_cafe.jpg"
                alt="Korean Cafe Birthday Cake"
                className="cake-image"
              />
              {cakeBlown && (
                <div className="cake-blown-badge pulse-glow">
                  ✨ Wish Dispatched to the Universe! ✨
                </div>
              )}
            </div>
          </div>

          <div className="cake-action-text">
            <button
              className={`btn-blow ${cakeBlown ? 'relight' : 'blow'}`}
              onClick={handleBlowCandle}
            >
              {candleLit ? (
                <>
                  <Flame size={18} className="flame-btn-icon" />
                  <span>Blow Out Candle & Make Wish</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Relight Candle 🎂</span>
                </>
              )}
            </button>

            {cakeBlown && (
              <div className="secret-wish-card">
                <p className="wish-message">
                  "To <strong>{herName}</strong>: May this year bring you endless laughs, cozy cafes,
                  dreamy sunny days, your favorite comfort snacks, and all the happiness you bring into
                  this world. Happy Birthday!"
                </p>
                <div className="wish-signature">— From {myName} 🫰</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
