import React from 'react';
import { useApp } from '../context/AppContext';
import { Music, Play, Pause, Volume2, VolumeX, Disc } from 'lucide-react';

export default function KdramaSoundtrackPlayer() {
  const { isBgmPlaying, toggleBgm, herName, myName } = useApp();

  return (
    <aside className="ost-floating-player glass-panel" aria-label="K-Drama OST Mini Player">
      <div className="player-inner">
        <div className={`disc-cover ${isBgmPlaying ? 'spinning' : ''}`}>
          <img
            src="/assets/kdrama_poster.jpg"
            alt="OST Album Art"
            className="disc-img"
          />
          <div className="disc-hole"></div>
        </div>

        <div className="player-meta">
          <div className="track-title-row">
            <span className="live-dot"></span>
            <strong className="track-name">Track 01: Spring Day's Promise (OST)</strong>
          </div>
          <span className="track-sub">For {herName} • Special Bday Edition</span>
        </div>

        <div className="player-controls">
          <button
            className="play-pause-btn"
            onClick={toggleBgm}
            title={isBgmPlaying ? 'Pause OST' : 'Play OST'}
          >
            {isBgmPlaying ? (
              <Pause size={17} fill="currentColor" />
            ) : (
              <Play size={17} fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
