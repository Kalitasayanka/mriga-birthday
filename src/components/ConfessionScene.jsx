import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Send, Copy, Check, MessageCircle, Star, ShieldCheck } from 'lucide-react';

const RESPONSE_OPTIONS = [
  {
    id: 'boba',
    emoji: '🧋',
    title: 'Let\'s grab boba & hang out!',
    subtitle: 'I\'d love to get to know more about you too.',
    defaultMsg: 'Hey! Your birthday site was so sweet and creative 😂 Let\'s definitely grab boba or coffee sometime soon!'
  },
  {
    id: 'kdrama',
    emoji: '🎬',
    title: 'You have to watch my favorite K-Drama first!',
    subtitle: 'Deal! We have serious drama recommendations to discuss.',
    defaultMsg: 'That birthday site was amazing! But first rule: we have to discuss K-dramas over coffee haha ☕'
  },
  {
    id: 'chat',
    emoji: '☕',
    title: 'Flattered! Let\'s keep chatting and see where the plot goes',
    subtitle: 'Low key, cozy vibes, taking it one episode at a time.',
    defaultMsg: 'Aww thank you for the super sweet birthday letter! Let\'s definitely keep chatting and get to know each other more 😊'
  },
  {
    id: 'friends',
    emoji: '🌸',
    title: 'Friends trope unlocked! Thank you for making my day special!',
    subtitle: 'Warmest friendship vibe, zero pressure, 100% appreciation.',
    defaultMsg: 'Thank you so much for putting so much effort into my birthday! You\'re such a great friend and this made my day 💖'
  },
  {
    id: 'custom',
    emoji: '✍️',
    title: 'Write my own custom reply',
    subtitle: 'Speak your mind in your own words.',
    defaultMsg: 'Hey, I just saw your birthday website! '
  }
];

export default function ConfessionScene() {
  const { herName, myName, selectedReaction, setSelectedReaction } = useApp();
  const [activeReaction, setActiveReaction] = useState(null);
  const [customText, setCustomText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const handleSelectReaction = (option) => {
    setActiveReaction(option);
    setSelectedReaction(option.id);
    let msg = option.defaultMsg;
    if (msg.startsWith('Hey!')) {
      msg = msg.replace('Hey!', `Hey ${myName}!`);
    } else if (msg.startsWith('Hey,')) {
      msg = msg.replace('Hey,', `Hey ${myName},`);
    } else {
      msg = `Hey ${myName}! ` + msg;
    }
    setCustomText(msg);
    soundEngine.playFanfare();
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff758f', '#ffb3c1', '#ffd166', '#c77dff']
    });
    setShowReplyModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(customText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <section className="confession-section">
      <div className="confession-container glass-panel">
        {/* Cinematic Subtitle Header */}
        <div className="scene-climax-header">
          <div className="climax-badge pulse-glow">
            <Heart size={16} fill="currentColor" />
            <span>EPISODE FINALE • THE CONFESSION</span>
          </div>
          <span className="climax-hangul">고백 씬: "내가 널 좋아하기 시작했어"</span>
        </div>

        {/* The Heartfelt Letter Card */}
        <article className="letter-wrapper">
          <div className="letter-decor-top">
            <span className="director-stamp">OFFICIAL SCRIPT • TAKE 1</span>
            <span className="soundtrack-cue">🎵 BGM: Soft Romantic Strings & Piano</span>
          </div>

          <div className="letter-body">
            <h1 className="letter-salutation serif-title">
              Dear <span className="text-gradient-pink">{herName}</span>,
            </h1>

            <p className="letter-paragraph">
              First and foremost — <strong>Happy, Happy Birthday!</strong> 🎂 Today is all about celebrating you,
              the energy you bring into the world, and every little thing that makes you the incredible person you are.
            </p>

            <p className="letter-paragraph highlight-box">
              <span className="quote-mark">“</span>
              I wanted to make something a little different and fun for your birthday — something worthy of a K-drama
              premiere. But behind all the cute tropes, interactive games, and playful quizzes, there's a simple, honest truth:
              <strong> somewhere along the way, I started to really like you.</strong>
            </p>

            <p className="letter-paragraph">
              Every time we talk, whether it's brief or long, you leave me with an involuntary smile. You have this
              effortless charm and warmth that genuinely brightens up my day.
            </p>

            {/* Respectful Low-Pressure Pledge Card */}
            <div className="no-pressure-card">
              <div className="no-pressure-icon">
                <ShieldCheck size={22} className="shield-icon" />
              </div>
              <div className="no-pressure-text">
                <strong>Zero Pressure Promise (진심이야):</strong>
                <p>
                  I really mean this: there is absolutely zero pressure on you. If you feel even a tiny bit of that
                  same spark, I’d be thrilled. But if you don't feel that way, or if your heart is somewhere else,
                  that is <strong>100% completely okay</strong>! No awkwardness, no strings attached. You are an
                  awesome person, and all I really want is for your birthday to feel as special as you are — and maybe,
                  if you're down, get to know more about the real you over boba or coffee sometime.
                </p>
              </div>
            </div>

            <div className="letter-signoff">
              <span>Warmest birthday wishes,</span>
              <strong className="signoff-name text-gradient-pink">{myName} 🫰</strong>
            </div>
          </div>
        </article>

        {/* Interactive Response Prompt */}
        <div className="interactive-response-section">
          <div className="response-header">
            <Sparkles size={20} className="sparkle-spin" />
            <h2 className="response-title serif-title">How does our Main Character respond?</h2>
            <p className="response-subtitle">Choose how you'd like Episode 1 to wrap up (or write your own!):</p>
          </div>

          <div className="responses-grid">
            {RESPONSE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className={`response-card ${selectedReaction === opt.id ? 'active' : ''}`}
                onClick={() => handleSelectReaction(opt)}
              >
                <div className="response-emoji">{opt.emoji}</div>
                <div className="response-text-group">
                  <h3 className="response-card-title">{opt.title}</h3>
                  <p className="response-card-desc">{opt.subtitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modal / Epilogue Reveal */}
        {showReplyModal && activeReaction && (
          <div className="reply-modal-backdrop" onClick={() => setShowReplyModal(false)}>
            <div className="reply-modal glass-panel" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-badge">
                  <span>EPILOGUE UNLOCKED</span>
                </div>
                <h3 className="modal-title serif-title">
                  {activeReaction.emoji} {activeReaction.title}
                </h3>
              </div>

              <p className="modal-instruction">
                Here's a cute pre-filled message you can send directly to {myName} to let him know:
              </p>

              <textarea
                className="reply-textarea"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
              />

              <div className="modal-actions">
                <button className="btn-secondary" onClick={handleCopy}>
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
                </button>

                <button className="btn-primary" onClick={handleWhatsAppSend}>
                  <MessageCircle size={18} />
                  <span>Send via WhatsApp / Text</span>
                </button>
              </div>

              <button className="close-modal-link" onClick={() => setShowReplyModal(false)}>
                Close Preview
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
