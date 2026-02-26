import { useState, useCallback } from 'react';
import type { Game } from '../data/games';

const STORAGE_KEY = 'classroomgames_recent';
const MAX_RECENT = 10;

export function useRecentGames() {
  const [recent, setRecent] = useState<Game[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addRecentGame = useCallback((game: Game) => {
    setRecent((prev) => {
      const filtered = prev.filter((g) => g.id !== game.id);
      const next = [game, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { recent, addRecentGame };
}
