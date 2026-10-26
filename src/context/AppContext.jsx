import React, { useState, useEffect, useCallback } from 'react';
import { AppContext } from './context';

export function AppProvider({ children }) {
  const urlParams = new URLSearchParams(window.location.search);
  const initialName = urlParams.get('to') || 'Mriga';
  const initialFrom = urlParams.get('from') || 'Sayanka';

  const [herName, setHerName] = useState(initialName);
  const [fromName, setFromName] = useState(initialFrom);
  const [candlesLit, setCandlesLit] = useState(true);
  const [wished, setWished] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Synchronize document title with dynamic recipient name
  useEffect(() => {
    document.title = `Happy Birthday ${herName}! 🎂✨`;
  }, [herName]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  const value = {
    herName,
    setHerName,
    fromName,
    setFromName,
    myName: fromName,
    candlesLit,
    setCandlesLit,
    wished,
    setWished,
    isMusicPlaying,
    setIsMusicPlaying,
    toastMessage,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
