import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';
import { X, Copy, Check, Sparkles, Sliders, Link, Heart } from 'lucide-react';

export default function DirectorModal() {
  const {
    isDirectorOpen,
    setIsDirectorOpen,
    herName,
    setHerName,
    myName,
    setMyName,
    getShareableUrl
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [tempHerName, setTempHerName] = useState(herName);
  const [tempMyName, setTempMyName] = useState(myName);

  if (!isDirectorOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (tempHerName.trim()) setHerName(tempHerName.trim());
    if (tempMyName.trim()) setMyName(tempMyName.trim());
    soundEngine.playChime();
    setIsDirectorOpen(false);
  };

  const handleCopyLink = () => {
    const shareUrl = getShareableUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      soundEngine.playCatch();
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="director-modal-backdrop" onClick={() => setIsDirectorOpen(false)}>
      <div className="director-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="director-modal-header">
          <div className="director-badge">
            <Sliders size={16} />
            <span>DIRECTOR'S CUT • PERSONALIZATION</span>
          </div>
          <button
            className="director-close-btn"
            onClick={() => setIsDirectorOpen(false)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className="director-title serif-title">Personalize The K-Drama Cast 🎬</h2>
        <p className="director-desc">
          Enter her name and your name so the entire story, quiz reactions, and confession card reflect both of you!
        </p>

        <form onSubmit={handleSave} className="director-form">
          <div className="form-group">
            <label className="form-label" htmlFor="her-name-input">
              <Heart size={14} className="label-icon" />
              <span>Her Name (The Birthday Heroine):</span>
            </label>
            <input
              id="her-name-input"
              type="text"
              className="form-input"
              value={tempHerName}
              onChange={(e) => setTempHerName(e.target.value)}
              placeholder="e.g. Minji, Sarah, Maya..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="my-name-input">
              <Sparkles size={14} className="label-icon" />
              <span>Your Name or Nickname (The Director):</span>
            </label>
            <input
              id="my-name-input"
              type="text"
              className="form-input"
              value={tempMyName}
              onChange={(e) => setTempMyName(e.target.value)}
              placeholder="e.g. Alex, Daniel, Your Secret Admirer..."
              required
            />
          </div>

          <div className="shareable-link-box">
            <div className="shareable-header">
              <Link size={15} />
              <span>Personalized Share Link</span>
            </div>
            <p className="shareable-note">
              Send this custom link directly to her so she sees her name instantly without having to change anything!
            </p>
            <div className="link-copy-row">
              <input
                type="text"
                readOnly
                value={getShareableUrl()}
                className="link-input-display"
              />
              <button type="button" className="btn-copy-link" onClick={handleCopyLink}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="director-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsDirectorOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Apply & Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
