import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { GameModal } from './components/GameModal';
import { LockScreen } from './components/LockScreen';
import { FloatingSearch } from './components/FloatingSearch';
import { Home } from './pages/Home';
import { GamesLibrary } from './pages/GamesLibrary';
import { WebSearcher } from './pages/WebSearcher';
import { SettingsPage } from './pages/Settings';
import { useSettings } from './hooks/useSettings';
import { usePanicMode } from './hooks/usePanicMode';
import { useTabCloak } from './hooks/useTabCloak';
import { useRecentGames } from './hooks/useRecentGames';
import type { Game } from './data/games';

export type Page = 'home' | 'library' | 'search' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locked, setLocked] = useState(true);

  const { settings, updateSettings } = useSettings();
  const { recent, addRecentGame } = useRecentGames();

  // Side effects from settings
  usePanicMode(settings);
  useTabCloak(settings.tabCloak);

  const handlePlayGame = (game: Game) => {
    addRecentGame(game);
    setActiveGame(game);
  };

  const handleFloatingSearch = (query: string) => {
    setSearchQuery(query);
    setPage('search');
  };

  // Apply font size
  const fontSizeClass =
    settings.fontSize === 'small' ? 'text-xs' :
    settings.fontSize === 'large' ? 'text-base' : 'text-sm';

  // Apply animations
  const animClass = settings.animations ? '' : '[&_*]:!transition-none [&_*]:!animation-none';

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

  return (
    <div className={`flex h-screen overflow-hidden bg-background ${fontSizeClass} ${animClass}`}>
      {/* Sidebar */}
      <Sidebar currentPage={page} onNavigate={setPage} iconsOnly={settings.sidebarIconsOnly} />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <header className="shrink-0 px-4 md:px-6 py-3 border-b border-white/5 flex items-center justify-between bg-background/80 backdrop-blur-sm">
          <div>
            <h1 className="font-display font-bold text-lg text-foreground leading-none">
              {page === 'home' && 'Dashboard'}
              {page === 'library' && 'Game Library'}
              {page === 'search' && 'Web Searcher'}
              {page === 'settings' && 'Settings'}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {page === 'home' && 'Your gaming hub'}
              {page === 'library' && 'Browse and play games'}
              {page === 'search' && 'Search the web'}
              {page === 'settings' && 'Customize your experience'}
            </p>
          </div>
          {settings.panicEnabled && (
            <div className="flex items-center gap-1.5 text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              Panic Mode Active
            </div>
          )}
        </header>

        {/* Page content */}
        {page === 'home' && (
          <Home onPlayGame={handlePlayGame} recent={recent} onNavigate={setPage} />
        )}
        {page === 'library' && (
          <GamesLibrary onPlayGame={handlePlayGame} />
        )}
        {page === 'search' && (
          <WebSearcher searchEngine={settings.searchEngine} initialQuery={searchQuery} />
        )}
        {page === 'settings' && (
          <SettingsPage settings={settings} updateSettings={updateSettings} onLock={() => setLocked(true)} />
        )}
      </main>

      {/* Game modal (full-screen overlay) */}
      {activeGame && (
        <GameModal game={activeGame} onClose={() => setActiveGame(null)} />
      )}

      {/* Floating search button (visible on all pages except search) */}
      {page !== 'search' && (
        <FloatingSearch
          searchEngine={settings.searchEngine}
          onOpenSearchPage={handleFloatingSearch}
        />
      )}
    </div>
  );
}
