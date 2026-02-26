import { useEffect, useRef } from 'react';
import type { AppSettings } from './useSettings';

export function usePanicMode(settings: AppSettings) {
  const lastEscapeTime = useRef<number>(0);

  useEffect(() => {
    if (!settings.panicEnabled) return;

    const triggerPanic = () => {
      if (settings.panicAction === 'redirect-google') {
        window.location.href = 'https://www.google.com';
      } else if (settings.panicAction === 'redirect-classroom') {
        window.location.href = 'https://classroom.google.com';
      } else if (settings.panicAction === 'custom-url') {
        window.location.href = settings.panicCustomUrl || 'https://www.google.com';
      } else if (settings.panicAction === 'close-tab') {
        window.close();
        setTimeout(() => {
          window.location.href = 'https://www.google.com';
        }, 200);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (settings.panicHotkey === 'escape2' && e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscapeTime.current < 500) {
          triggerPanic();
        }
        lastEscapeTime.current = now;
      } else if (settings.panicHotkey === 'f12' && e.key === 'F12') {
        e.preventDefault();
        triggerPanic();
      } else if (settings.panicHotkey === 'ctrl-q' && e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        triggerPanic();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.panicEnabled, settings.panicAction, settings.panicHotkey, settings.panicCustomUrl]);
}
