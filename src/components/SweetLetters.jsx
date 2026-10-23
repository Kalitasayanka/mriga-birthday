import React, { useState, useRef } from 'react';
import { useApp } from '../context/useApp';
import confetti from 'canvas-confetti';
import { playHeartChime, playPop } from '../utils/audio';

const LETTERS_DATA = [
  {
    id: 'birthday',
    seal: '🎂',
    color: '#f4a261',
    badge: 'Birthday Note',
    title: 'Wishing You the Happiest Birthday',
    subtitle: 'Celebrating you today',
    greeting: (herName) => `Dear ${herName},`,
    paragraphs: [
      `First and foremost — Happy Birthday! 🎂 Today is all about celebrating you: the positive energy you bring into every room, your wonderful smile, and all the thoughtful things that make you uniquely who you are.`,
      `I wanted to build something special for your birthday because an ordinary text message just felt too simple. You truly deserve to take center stage today and be celebrated.`,
      `I still don't know much about you nor have I met you in person, so I don't have too much content to add here just yet — but I'm really looking forward to learning more about you: your favorite color, food, activity, song, and everything!`,
      `May your day be filled with all your favorite things: delicious food, great music, endless laughter, and memories you'll look back on with a huge smile.`,
      `Here's to another fantastic year of exciting adventures, new milestones, and happiness in everything you set out to do. Have the most wonderful birthday!`,
    ],
    highlightIdx: 3,
  },
  {
    id: 'little-things',
    seal: '✨',
    color: '#ffd166',
    badge: 'Good Vibes',
    title: 'Things That Make You Stand Out',
    subtitle: 'Appreciating who you are',
    greeting: (herName) => `To ${herName},`,
    paragraphs: [
      `It's often the quiet, everyday things that make someone truly stand out, and you have so many wonderful qualities.`,
      `The way your enthusiasm lights up when you talk about things you care about and how easy you make it for people around you to feel comfortable and smile.`,
      `You carry yourself with a natural sincerity and kindness that is really rare and refreshing in a noisy world.`,
      `Never lose that genuine spark and positive spirit. You are doing great, and it's always a pleasure being around your good energy.`,
    ],
    highlightIdx: 2,
  },
  {
    id: 'rough-day',
    seal: '🌧️',
    color: '#7ec8e3',
    badge: 'Open When Needed',
    title: 'A Reminder for Tough Days',
    subtitle: 'A little encouragement in your pocket',
    greeting: (herName) => `Hey ${herName},`,
    paragraphs: [
      `If you ever happen to read this on an exhausting or overwhelming day, take a slow, deep breath right now.`,
      `You don't always have to have everything sorted out, and you don't have to carry the weight of the world on your shoulders. It is completely okay to take a break and rest.`,
      `Remember that tough days are only temporary, but your strength and capability are permanent. You've navigated through every challenge before, and you'll conquer whatever comes next.`,
      `Be patient and kind to yourself. You are appreciated, capable, and doing so much better than you give yourself credit for!`,
    ],
    highlightIdx: 2,
  },
  {
    id: 'wishes',
    seal: '🌟',
    color: '#c9b1ff',
    badge: 'Looking Ahead',
    title: 'Hopes for Your Year Ahead',
    subtitle: 'May this year be your best yet',
    greeting: (herName) => `Dearest ${herName},`,
    paragraphs: [
      `A new birthday marks the beginning of a fresh 365-day chapter waiting for your best stories to unfold.`,
      `I hope this upcoming year brings you exciting opportunities, peaceful mornings with your favorite drinks, and friendships that make you feel supported and heard.`,
      `May you crush your personal goals, discover new favorite places, and have plenty of moments where you laugh until your stomach hurts.`,
      `Wishing you peace, success, and pure joy in all your endeavors this year. You've got so much greatness ahead!`,
    ],
    highlightIdx: 2,
  },
  {
    id: 'smile',
    seal: '☕',
    color: '#e07a8e',
    badge: 'Pick-Me-Up',
    title: 'A Pocketful of Good Energy',
    subtitle: 'A quick smile just for you',
    greeting: (herName) => `Hey ${herName} ✨,`,
    paragraphs: [
      `Just in case you needed a quick reminder today: your smile and positive energy are genuinely contagious.`,
      `You have a natural knack for brightening up the mood wherever you are, you bring good vibes along.`,
      `I hope today treats you like royalty: zero stress, your favorite songs playing, delicious cake, and lots of celebrating.`,
      `Keep shining and smiling. Have a truly wonderful birthday!`,
    ],
    highlightIdx: 1,
  },
];

export default function SweetLetters() {
  const { herName, myName, showToast } = useApp();
  const [activeLetterId, setActiveLetterId] = useState(null);
  const [openedLetters, setOpenedLetters] = useState({ birthday: true });
  const [cheerCount, setCheerCount] = useState(0);

  // Swipe gesture state
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizontalSwipe = useRef(null);

  const activeIdx = activeLetterId
    ? LETTERS_DATA.findIndex((l) => l.id === activeLetterId)
    : 0;
  const activeLetter = activeLetterId
    ? LETTERS_DATA[activeIdx]
    : null;

  const handleOpenLetter = (letter) => {
    setActiveLetterId(letter.id);
    setOpenedLetters((prev) => ({ ...prev, [letter.id]: true }));
    playHeartChime();

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
      colors: [letter.color, '#ffd166', '#ffffff', '#e8a87c'],
    });
  };

  const handleCloseLetter = () => {
    playPop();
    setDragOffset(0);
    setActiveLetterId(null);
  };

  const handleNextLetter = () => {
    playPop();
    const nextIdx = (activeIdx + 1) % LETTERS_DATA.length;
    const nextLetter = LETTERS_DATA[nextIdx];
    setActiveLetterId(nextLetter.id);
    setOpenedLetters((prev) => ({ ...prev, [nextLetter.id]: true }));
    playHeartChime();
    setDragOffset(0);
  };

  const handlePrevLetter = () => {
    playPop();
    const prevIdx = (activeIdx - 1 + LETTERS_DATA.length) % LETTERS_DATA.length;
    const prevLetter = LETTERS_DATA[prevIdx];
    setActiveLetterId(prevLetter.id);
    setOpenedLetters((prev) => ({ ...prev, [prevLetter.id]: true }));
    playHeartChime();
    setDragOffset(0);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Detect direction on first movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        isHorizontalSwipe.current = true;
      } else if (Math.abs(diffY) > 8) {
        isHorizontalSwipe.current = false;
      }
    }

    if (isHorizontalSwipe.current) {
      // Damped drag resistance
      setDragOffset(diffX * 0.75);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 55;
    if (dragOffset < -threshold) {
      // Swiped Left -> Next letter
      handleNextLetter();
    } else if (dragOffset > threshold) {
      // Swiped Right -> Previous letter
      handlePrevLetter();
    } else {
      // Snap back
      setDragOffset(0);
    }
    isHorizontalSwipe.current = null;
  };

  const handleSendCheers = () => {
    setCheerCount((prev) => prev + 1);
    playPop();
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffd166', '#f4a261', '#e07a8e', '#7ec8e3'],
    });
    showToast(`🎉 Sent birthday cheer #${cheerCount + 1}! ✨`);
  };

  return (
    <section className="letters-section container py-4 px-3" id="letters">
      {/* Section Header */}
      <div className="section-header text-center mb-4">
        <span className="badge rounded-pill section-tag mb-2">
          💌 Touch & Swipe Letters
        </span>
        <h2 className="section-title serif">Sweet Letters for {herName}</h2>
        <p className="section-desc mx-auto">
          Swipe left or right through the letters below with your thumb!
        </p>
      </div>

      {/* SWIPEABLE LETTER READER VIEW */}
      {activeLetter ? (
        <div className="opened-letter-view animate-in">
          {/* Top Swipe Bar & Navigation */}
          <div className="d-flex align-items-center justify-content-between mb-3 px-1">
            <button
              className="btn btn-sm btn-back-desk rounded-pill"
              onClick={handleCloseLetter}
            >
              ← All Letters
            </button>
            <div className="d-flex align-items-center gap-2">
              <span className="letter-counter-badge badge rounded-pill px-3 py-2">
                {activeIdx + 1} of {LETTERS_DATA.length}
              </span>
            </div>
          </div>

          {/* Swipe Instruction Banner */}
          <div className="swipe-hint-banner text-center py-2 px-3 mb-3 rounded-pill">
            <span className="swipe-arrow-left">👈</span>
            <span className="swipe-text mx-2">Swipe card to flip letters</span>
            <span className="swipe-arrow-right">👉</span>
          </div>

          {/* Swipeable Parchment Card Container */}
          <div
            className="swipe-card-wrapper position-relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.035}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="parchment-card card border-0 shadow-lg">
              <div className="parchment-header d-flex align-items-center gap-3 mb-3">
                <span className="parchment-seal">{activeLetter.seal}</span>
                <div className="parchment-titles">
                  <span
                    className="badge rounded-pill mb-1"
                    style={{
                      backgroundColor: `${activeLetter.color}22`,
                      color: activeLetter.color,
                      border: `1px solid ${activeLetter.color}55`,
                    }}
                  >
                    {activeLetter.badge}
                  </span>
                  <h3 className="parchment-title serif mb-0">{activeLetter.title}</h3>
                </div>
              </div>

              <div className="parchment-divider" />

              <div className="parchment-body">
                <h4 className="parchment-greeting serif mb-3">
                  {activeLetter.greeting(herName)}
                </h4>

                {activeLetter.paragraphs.map((para, idx) => {
                  const isHighlight = idx === activeLetter.highlightIdx;

                  if (isHighlight) {
                    return (
                      <div key={idx} className="letter-highlight-box rounded p-3 my-3">
                        <p className="mb-0">{para}</p>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="parchment-para mb-3">
                      {para}
                    </p>
                  );
                })}

                <div className="parchment-signoff mt-4">
                  <span className="signoff-label d-block small">With warmest birthday wishes,</span>
                  <strong className="signoff-author serif">{myName}</strong>
                </div>
              </div>

              <div className="parchment-footer mt-4 text-center">
                <button
                  className="btn btn-sm btn-fold rounded-pill px-3 py-2"
                  onClick={handleCloseLetter}
                >
                  ✉️ Put letter back into envelope
                </button>
              </div>
            </div>
          </div>

          {/* Swipe Indicator Dots */}
          <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
            {LETTERS_DATA.map((l, i) => (
              <button
                key={l.id}
                className={`swipe-dot-btn ${i === activeIdx ? 'active' : ''}`}
                onClick={() => {
                  setActiveLetterId(l.id);
                  playPop();
                }}
                aria-label={`Go to letter ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Envelope Desk / Swipeable Gallery */
        <div className="envelopes-deck">
          {/* Horizontal Swipe Scroll Deck */}
          <div className="horizontal-swipe-deck pb-3">
            {LETTERS_DATA.map((letter) => {
              const isRead = !!openedLetters[letter.id];

              return (
                <div
                  key={letter.id}
                  className={`envelope-desk-item card ${isRead ? 'read' : 'unread'}`}
                  onClick={() => handleOpenLetter(letter)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleOpenLetter(letter);
                  }}
                >
                  <div className="envelope-top-bar d-flex justify-content-between align-items-center mb-2">
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: `${letter.color}25`,
                        color: letter.color,
                        border: `1px solid ${letter.color}55`,
                      }}
                    >
                      {letter.badge}
                    </span>
                    {isRead && (
                      <span className="badge-opened rounded-pill px-2 py-1 small">
                        ✓ Opened
                      </span>
                    )}
                  </div>

                  <div className="envelope-center-seal text-center my-3">
                    <div
                      className="wax-seal-icon mx-auto"
                      style={{ borderColor: `${letter.color}55` }}
                    >
                      <span>{letter.seal}</span>
                    </div>
                  </div>

                  <div className="envelope-info text-center mb-2">
                    <h3 className="envelope-item-title serif mb-1">{letter.title}</h3>
                    <p className="envelope-item-sub small mb-0">{letter.subtitle}</p>
                  </div>

                  <div className="envelope-action-hint text-center mt-auto pt-2">
                    <span className="envelope-action-pill badge rounded-pill px-3 py-1">
                      Tap or swipe to open 💌
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="swipe-deck-hint text-center small mt-2">
            👉 Scroll or swipe cards horizontally to explore all letters
          </p>
        </div>
      )}

      {/* Birthday Cheers Interaction */}
      <div className="hug-container text-center mt-4">
        <button
          className="btn btn-lg btn-gradient-cheer rounded-pill px-4 py-3 shadow"
          onClick={handleSendCheers}
        >
          🎉 Send Birthday Cheers {cheerCount > 0 && `(${cheerCount})`}
        </button>
        <p className="hug-hint small mt-2 mb-0">
          Tap for celebration confetti! ✨
        </p>
      </div>
    </section>
  );
}
