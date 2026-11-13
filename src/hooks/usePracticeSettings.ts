import { useState, useEffect, useCallback } from 'react';
import type { PracticeSettings, FontSize, Difficulty } from '../types/typing';

const SETTINGS_STORAGE_KEY = 't4type-settings';

const DEFAULT_SETTINGS: PracticeSettings = {
  fontSize: 'medium',
  difficulty: 'normal',
  sound: false,
};

function loadStoredSettings(): PracticeSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<PracticeSettings>;
    return {
      fontSize:
        parsed.fontSize === 'small' ||
        parsed.fontSize === 'medium' ||
        parsed.fontSize === 'large'
          ? parsed.fontSize
          : DEFAULT_SETTINGS.fontSize,
      difficulty:
        parsed.difficulty === 'easy' ||
        parsed.difficulty === 'normal' ||
        parsed.difficulty === 'advanced'
          ? parsed.difficulty
          : DEFAULT_SETTINGS.difficulty,
      sound: typeof parsed.sound === 'boolean' ? parsed.sound : DEFAULT_SETTINGS.sound,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function usePracticeSettings() {
  const [settings, setSettings] = useState<PracticeSettings>(loadStoredSettings);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    setSettings((prev) => ({ ...prev, difficulty }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((prev) => ({ ...prev, sound: !prev.sound }));
  }, []);

  return {
    settings,
    setFontSize,
    setDifficulty,
    toggleSound,
  };
}

