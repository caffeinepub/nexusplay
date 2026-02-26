import { useState, useCallback } from 'react';

export type PanicAction = 'redirect-google' | 'redirect-classroom' | 'close-tab' | 'custom-url';
export type PanicHotkey = 'escape2' | 'f12' | 'ctrl-q';
export type SearchEngine = 'duckduckgo' | 'bing' | 'google';
export type AccentColor = 'purple' | 'cyan' | 'orange' | 'green';
export type BgTheme = 'dark' | 'midnight-blue' | 'deep-green' | 'charcoal';
export type FontSize = 'small' | 'medium' | 'large';
export type TabCloak = 'none' | 'google-docs' | 'google-drive' | 'canvas' | 'schoology' | 'khan-academy' | 'desmos' | 'gmail' | 'zoom' | 'wikipedia';

export interface AppSettings {
  tabCloak: TabCloak;
  panicEnabled: boolean;
  panicAction: PanicAction;
  panicHotkey: PanicHotkey;
  panicCustomUrl: string;
  searchEngine: SearchEngine;
  accentColor: AccentColor;
  bgTheme: BgTheme;
  fontSize: FontSize;
  animations: boolean;
  sidebarIconsOnly: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  tabCloak: 'none',
  panicEnabled: false,
  panicAction: 'redirect-google',
  panicHotkey: 'escape2',
  panicCustomUrl: 'https://classroom.google.com',
  searchEngine: 'duckduckgo',
  accentColor: 'purple',
  bgTheme: 'dark',
  fontSize: 'medium',
  animations: true,
  sidebarIconsOnly: false,
};

const STORAGE_KEY = 'classroomgames_settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Also try old key for backwards compat
      const oldStored = localStorage.getItem('nexusplay_settings');
      const base = stored || oldStored || null;
      if (base) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(base) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { settings, updateSettings };
}

export const TAB_CLOAK_OPTIONS: Array<{
  id: TabCloak;
  label: string;
  title: string;
  favicon: string;
}> = [
  {
    id: 'none',
    label: 'Classroom Games (Default)',
    title: 'Classroom Games',
    favicon: '/favicon.ico',
  },
  {
    id: 'google-docs',
    label: 'Google Docs',
    title: 'Document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  },
  {
    id: 'google-drive',
    label: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
  },
  {
    id: 'canvas',
    label: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
  },
  {
    id: 'schoology',
    label: 'Schoology',
    title: 'Schoology',
    favicon: 'https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico',
  },
  {
    id: 'khan-academy',
    label: 'Khan Academy',
    title: 'Khan Academy',
    favicon: 'https://cdn.kastatic.org/images/favicon.ico',
  },
  {
    id: 'desmos',
    label: 'Desmos',
    title: 'Desmos Graphing Calculator',
    favicon: 'https://www.desmos.com/assets/img/favicon.ico',
  },
  {
    id: 'gmail',
    label: 'Gmail',
    title: 'Inbox - Gmail',
    favicon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
  },
  {
    id: 'zoom',
    label: 'Zoom',
    title: 'Zoom',
    favicon: 'https://st1.zoom.us/zoom.ico',
  },
  {
    id: 'wikipedia',
    label: 'Wikipedia',
    title: 'Wikipedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
  },
];
