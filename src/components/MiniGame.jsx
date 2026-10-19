import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Heart, RotateCcw, ArrowRight, Play } from 'lucide-react';

const ITEMS = [
  { emoji: '🧋', name: 'Boba Milk Tea', points: 1 },
  { emoji: '🍰', name: 'Strawberry Cake', points: 1 },
  { emoji: '🫰', name: 'Finger Heart', points: 1 },
  { emoji: '☂️', name: 'Yellow Umbrella', points: 1 },
  { emoji: '⭐', name: 'Birthday Star', points: 1 },
  { emoji: '🍓', name: 'Fresh Strawberry', points: 1 }
];

export default function MiniGame() {
  const { herName, myName, setActiveTab, setGameUnlocked } = useApp();
  const canvasRef = useRef(null);

  const [gameState, setGameState] = useState('idle'); // 'idle', 'playing', 'won'
  const [score, setScore] = useState(0);
  const TARGET_SCORE = 10;

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = Math.min(450, window.innerHeight * 0.55));

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(450, window.innerHeight * 0.55);
    };
    window.addEventListener('resize', handleResize);

    // Paddle / Catcher state
    let paddleX = width / 2;
    const paddleWidth = 84;
    const paddleHeight = 22;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      paddleX = Math.max(paddleWidth / 2, Math.min(width - paddleWidth / 2, e.clientX - rect.left));
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        paddleX = Math.max(
          paddleWidth / 2,
          Math.min(width - paddleWidth / 2, e.touches[0].clientX - rect.left)
        );
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Falling items
    let fallingObjects = [];
    let spawnTimer = 0;
    let currentScore = score;

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn new items every ~40 frames
      spawnTimer++;
      if (spawnTimer % 38 === 0) {
        const randomItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        fallingObjects.push({
          x: Math.random() * (width - 60) + 30,
          y: -20,
          speed: Math.random() * 1.8 + 2.2,
          emoji: randomItem.emoji,
          size: 32,
          angle: 0,
          rotSpeed: (Math.random() - 0.5) * 0.04
        });
      }

      // Draw and update falling objects
      for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const item = fallingObjects[i];
        item.y += item.speed;
        item.angle += item.rotSpeed;

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.angle);
        ctx.font = `${item.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.emoji, 0, 0);
        ctx.restore();

        // Check collision with paddle
        const paddleY = height - 40;
        if (
          item.y + item.size / 2 >= paddleY &&
          item.y - item.size / 2 <= paddleY + paddleHeight &&
          item.x >= paddleX - paddleWidth / 2 &&
          item.x <= paddleX + paddleWidth / 2
        ) {
          // Caught item!
          soundEngine.playCatch();
          fallingObjects.splice(i, 1);
          currentScore++;
          setScore(currentScore);

          if (currentScore >= TARGET_SCORE) {
            setGameState('won');
            setGameUnlocked(true);
            soundEngine.playFanfare();
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.5 }
            });
            cancelAnimationFrame(animationId);
            return;
          }
          continue;
        }

        // Remove if off bottom
        if (item.y > height + 40) {
          fallingObjects.splice(i, 1);
        }
      }

      // Draw Paddle (Aesthetic Glowing Heart Basket)
      const pY = height - 40;
      ctx.save();
      // Glow effect
      ctx.shadowColor = 'rgba(255, 117, 143, 0.7)';
      ctx.shadowBlur = 15;

      const grad = ctx.createLinearGradient(
        paddleX - paddleWidth / 2,
        pY,
        paddleX + paddleWidth / 2,
        pY + paddleHeight
      );
      grad.addColorStop(0, '#ff758f');
      grad.addColorStop(1, '#c77dff');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(paddleX - paddleWidth / 2, pY, paddleWidth, paddleHeight, 12);
      ctx.fill();

      // Cute label on paddle
      ctx.shadowBlur = 0;
      ctx.font = 'bold 12px Outfit, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💖 CATCH', paddleX, pY + paddleHeight / 2);
      ctx.restore();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, [gameState]);

  const startGame = () => {
    setScore(0);
    setGameState('playing');
    soundEngine.playChime();
  };

  return (
    <div className="game-section">
      <div className="game-container glass-panel">
        <div className="game-header">
          <div className="game-header-badge">
            <Trophy size={16} />
            <span>K-DRAMA BONUS MINI-GAME</span>
          </div>
          <div className="score-pill">
            <Sparkles size={14} className="star-icon" />
            <span>
              Target: {score} / {TARGET_SCORE} Items
            </span>
          </div>
        </div>

        <h2 className="game-title serif-title">Catch the Birthday Treats & Stars! 🧋</h2>
        <p className="game-subtitle">
          Move your basket across the screen to collect boba, strawberry cake, umbrellas, and finger hearts.
        </p>

        {/* Game Canvas Container */}
        <div className="canvas-wrapper">
          {gameState === 'idle' && (
            <div className="game-overlay start-overlay">
              <div className="overlay-icon">🎮</div>
              <h3 className="overlay-title">Ready to Play, {herName}?</h3>
              <p className="overlay-desc">
                Catch 10 birthday treasures to unlock the 100% Chemistry rating and unveil the episode climax!
              </p>
              <div className="overlay-btns">
                <button className="btn-primary" onClick={startGame}>
                  <Play size={18} fill="currentColor" />
                  <span>Start Game</span>
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    soundEngine.playChime();
                    setActiveTab('confession');
                  }}
                >
                  <span>Skip Straight to Climax 💌</span>
                </button>
              </div>
            </div>
          )}

          {gameState === 'won' && (
            <div className="game-overlay win-overlay">
              <div className="overlay-icon pulse-glow">🎉</div>
              <h3 className="overlay-title">Episode Climax Unlocked!</h3>
              <p className="overlay-desc">
                100% Chemistry rating achieved! You caught all the sweet birthday treats.
              </p>
              <div className="overlay-btns">
                <button
                  className="btn-primary"
                  onClick={() => {
                    soundEngine.playChime();
                    soundEngine.playDramaticSwell();
                    setActiveTab('confession');
                  }}
                >
                  <span>Read The Confession Letter 💌</span>
                  <ArrowRight size={18} />
                </button>
                <button className="btn-secondary" onClick={startGame}>
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="game-canvas" />
        </div>

        {/* Footer controls */}
        <div className="game-footer">
          <span className="control-hint">💡 Tip: Use your mouse or finger drag to move the pink basket!</span>
          <button
            className="text-link-btn"
            onClick={() => {
              soundEngine.playChime();
              setActiveTab('confession');
            }}
          >
            Go directly to the letter →
          </button>
        </div>
      </div>
    </div>
  );
}
