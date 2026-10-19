import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, ChevronRight, Copy, Check, Heart, HelpCircle, Film } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    episode: 'Scene 01: The Sudden Downpour',
    prompt: 'You are caught in an unexpected rainstorm outside. Which classic K-drama trope are you choosing?',
    options: [
      {
        text: 'The classic yellow umbrella appears over your head from behind',
        reply: "Classic, timeless, and effortlessly romantic. (I'll keep a spare umbrella handy just in case ☂️)",
        vibe: 'Romantic Classic'
      },
      {
        text: 'Grabbing each other\'s sleeves and dashing into a 24/7 convenience store for warm ramen',
        reply: "My kind of spontaneous adventure! Cozy vibes > everything else 🍜",
        vibe: 'Cozy Adventurer'
      },
      {
        text: 'Pulling an oversized jacket over both our heads and laughing through the rain',
        reply: "100% main character energy! Pure cinematic happiness ✨",
        vibe: 'Playful Free-Spirit'
      }
    ]
  },
  {
    id: 2,
    episode: 'Scene 02: Midnight Comfort Craving',
    prompt: 'It\'s 11:30 PM and you\'ve been binge-watching your favorite drama. What\'s your ultimate treat?',
    options: [
      {
        text: 'Crispy Korean fried chicken & sweet peach iced tea',
        reply: "Unbeatable! Late-night chicken hits different every single time 🍗",
        vibe: 'Foodie Heart'
      },
      {
        text: 'Aesthetic strawberry bingsu or brown sugar boba milk tea',
        reply: "Sweet tooth confirmed! I officially owe you a boba run 🧋",
        vibe: 'Sweet Sweetheart'
      },
      {
        text: 'Spicy Shin Ramyun cooked in a golden pot with cheese & egg',
        reply: "'Do you want to eat ramen?' — the ultimate K-drama code phrase haha! 🍜",
        vibe: 'Drama Connoisseur'
      }
    ]
  },
  {
    id: 3,
    episode: 'Scene 03: The Male Lead Vibe',
    prompt: 'Which drama male lead personality has your heart every time?',
    options: [
      {
        text: 'The quiet, teasing guy who seems aloof but remembers every tiny detail about you',
        reply: "The detail-oriented softie. Taking mental notes right now... ✍️",
        vibe: 'Gentle Observer'
      },
      {
        text: 'The funny, energetic best friend who brings you snacks and makes you laugh until your stomach hurts',
        reply: "Good laughs and snacks are non-negotiable. I promise to deliver both! 😄",
        vibe: 'Laughter Seeker'
      },
      {
        text: 'The fiercely supportive protector who always has your back no matter what',
        reply: "Loyal, dependable, and always in your corner. Exactly how it should be 🛡️",
        vibe: 'Steadfast Heart'
      }
    ]
  },
  {
    id: 4,
    episode: 'Scene 04: The Dream Hangout',
    prompt: 'If we ever hung out for an afternoon, what would be the most fun activity?',
    options: [
      {
        text: 'Hunting down a cute pastel cafe with great music and chatting for hours',
        reply: "I could honestly listen to you talk about your favorite things all afternoon ☕",
        vibe: 'Cafe Explorer'
      },
      {
        text: 'Evening Han River stroll with fairy lights and music in our earphones',
        reply: "Golden hour sunset by the water? Say no more, that's top tier 🌅",
        vibe: 'Sunset Dreamer'
      },
      {
        text: 'Arcade games, trying to win plushies from the claw machine, and street food hopping',
        reply: "Challenge accepted! I will win you that giant plushie even if it takes 20 tries 🧸",
        vibe: 'Arcade Champion'
      }
    ]
  },
  {
    id: 5,
    episode: 'Scene 05: The OST Climax',
    prompt: 'When a heartfelt scene arrives, what soundtrack melody gives you goosebumps?',
    options: [
      {
        text: 'A gentle acoustic guitar and whispered Korean vocals',
        reply: "Soft, intimate, and warm like a wool sweater in autumn 🍂",
        vibe: 'Indie Soul'
      },
      {
        text: 'An emotional grand piano ballad that makes your chest ache with butterflies',
        reply: "The ultimate heart-flutterer! You have impeccable taste 🎹",
        vibe: 'Emotional Romantic'
      },
      {
        text: 'A sunny, bouncy upbeat pop song that puts an instant smile on your face',
        reply: "Pure infectious joy! Just like your energy ✨",
        vibe: 'Sunshine Vibe'
      }
    ]
  }
];

export default function TropeQuiz() {
  const { herName, myName, setActiveTab, setQuizFinished, setQuizScore } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentQ = QUESTIONS[currentIdx];
  const isLastQuestion = currentIdx === QUESTIONS.length - 1;
  const isComplete = Object.keys(answers).length === QUESTIONS.length;

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setShowFeedback(true);
    soundEngine.playChime();

    const updated = {
      ...answers,
      [currentQ.id]: {
        questionPrompt: currentQ.prompt,
        chosenText: option.text,
        reply: option.reply,
        vibe: option.vibe
      }
    };
    setAnswers(updated);
    setQuizScore(updated);
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);

    if (!isLastQuestion) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      soundEngine.playFanfare();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  // Generate Archetype Summary
  const getArchetype = () => {
    return {
      title: 'The Irresistible Main Character (주인공)',
      tagline: 'Warm-hearted, hopelessly charming, and destined for great adventures.',
      description: `Based on your choices, you bring warmth, laughter, and an effortless magnetic charm everywhere you go. You appreciate the little moments — cozy chats, great snacks, and genuine connections.`
    };
  };

  const handleCopyAnswers = () => {
    let summaryText = `🌸 ${herName}'s K-Drama Birthday Quiz Answers:\n\n`;
    QUESTIONS.forEach((q) => {
      const a = answers[q.id];
      if (a) {
        summaryText += `✨ ${q.episode}\nChoice: ${a.chosenText}\n\n`;
      }
    });
    summaryText += `💌 Sent to: ${myName} (${getArchetype().title})`;

    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div className="quiz-section">
      <div className="quiz-container glass-panel">
        {/* Quiz Progress Header */}
        <div className="quiz-header">
          <div className="quiz-header-badge">
            <Film size={16} />
            <span>K-DRAMA GETTING-TO-KNOW-YOU QUIZ</span>
          </div>
          <div className="quiz-step-counter">
            {isComplete && showFeedback === false
              ? 'EPISODE COMPLETE'
              : `SCENE ${currentIdx + 1} OF ${QUESTIONS.length}`}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${((Object.keys(answers).length) / QUESTIONS.length) * 100}%`
            }}
          ></div>
        </div>

        {!isComplete || showFeedback ? (
          /* Active Question Screen */
          <div className="question-content">
            <span className="scene-label">{currentQ.episode}</span>
            <h2 className="question-prompt serif-title">{currentQ.prompt}</h2>

            <div className="options-grid">
              {currentQ.options.map((opt, i) => {
                const isChosen = selectedOption?.text === opt.text;
                return (
                  <button
                    key={i}
                    className={`option-card ${isChosen ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(opt)}
                    disabled={showFeedback && !isChosen}
                  >
                    <div className="option-indicator">
                      {isChosen ? <CheckCircle2 size={18} className="check-icon" /> : <span className="opt-letter">{String.fromCharCode(65 + i)}</span>}
                    </div>
                    <span className="option-text">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* In-Character Response Feedback */}
            {showFeedback && selectedOption && (
              <div className="flirty-feedback-box">
                <div className="feedback-avatar">🎬</div>
                <div className="feedback-body">
                  <div className="feedback-author">{myName}'s Reaction:</div>
                  <p className="feedback-text">{selectedOption.reply}</p>
                </div>
              </div>
            )}

            {/* Next / Proceed Button */}
            {showFeedback && (
              <div className="next-action-row">
                <button className="btn-primary" onClick={handleNext}>
                  <span>{isLastQuestion ? 'Reveal My K-Drama Result' : 'Next Scene'}</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Completed Archetype Profile */
          <div className="result-content">
            <div className="result-badge-wrap pulse-glow">
              <Sparkles size={28} className="sparkle-result" />
            </div>
            <span className="result-korean-subtitle">HEROINE ARCHETYPE REVEALED</span>
            <h2 className="result-title serif-title">{getArchetype().title}</h2>
            <p className="result-tagline">{getArchetype().tagline}</p>
            <p className="result-desc">{getArchetype().description}</p>

            {/* Answer recap pills */}
            <div className="recap-cards-box">
              <h3 className="recap-title">Your Episode Highlights:</h3>
              <div className="recap-list">
                {QUESTIONS.map((q) => (
                  <div key={q.id} className="recap-item">
                    <span className="recap-q">{q.episode.split(':')[0]}:</span>
                    <span className="recap-a">{answers[q.id]?.chosenText}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-actions">
              <button className="btn-secondary" onClick={handleCopyAnswers}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                <span>{copied ? 'Copied to Clipboard! 🎉' : 'Copy My Answers (To Send Him!)'}</span>
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  soundEngine.playChime();
                  setActiveTab('game');
                }}
              >
                <span>Play Mini-Game: Catch The Stars</span>
                <ChevronRight size={18} />
              </button>

              <button
                className="btn-confession-direct"
                onClick={() => {
                  soundEngine.playChime();
                  setActiveTab('confession');
                }}
              >
                <Heart size={16} />
                <span>Jump Straight to His Confession 💌</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
