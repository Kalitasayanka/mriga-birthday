import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Read initial values from URL query parameters (?to=Name&from=Name), localStorage, or default to Prity & Sayanka
  const urlParams = new URLSearchParams(window.location.search);
  const storedHer = localStorage.getItem('kdrama_her_name');
  const initialHerName = urlParams.get('to') || (storedHer && storedHer !== 'Birthday Girl 🌸' ? storedHer : 'Prity');
  const storedMe = localStorage.getItem('kdrama_my_name');
  const initialMyName = urlParams.get('from') || (storedMe && storedMe !== 'Your Secret Admirer' ? storedMe : 'Sayanka');

  const [herName, setHerName] = useState(initialHerName);
  const [myName, setMyName] = useState(initialMyName);
  const [activeTab, setActiveTab] = useState('intro'); // 'intro', 'quiz', 'game', 'confession'
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isDirectorOpen, setIsDirectorOpen] = useState(false);
  const [quizScore, setQuizScore] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [gameUnlocked, setGameUnlocked] = useState(false);
  const [cakeBlown, setCakeBlown] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [selectedReaction, setSelectedReaction] = useState(null);

  useEffect(() => {
    localStorage.setItem('kdrama_her_name', herName);
  }, [herName]);

  useEffect(() => {
    localStorage.setItem('kdrama_my_name', myName);
  }, [myName]);

  const toggleBgm = () => {
    if (isBgmPlaying) {
      soundEngine.stopBGM();
      setIsBgmPlaying(false);
    } else {
      soundEngine.startBGM();
      setIsBgmPlaying(true);
    }
  };

  const getShareableUrl = () => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('to', herName);
    url.searchParams.set('from', myName);
    return url.toString();
  };

  return (
    <AppContext.Provider
      value={{
        herName,
        setHerName,
        myName,
        setMyName,
        activeTab,
        setActiveTab,
        isBgmPlaying,
        toggleBgm,
        isDirectorOpen,
        setIsDirectorOpen,
        quizScore,
        setQuizScore,
        quizFinished,
        setQuizFinished,
        gameUnlocked,
        setGameUnlocked,
        cakeBlown,
        setCakeBlown,
        candleLit,
        setCandleLit,
        selectedReaction,
        setSelectedReaction,
        getShareableUrl
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
