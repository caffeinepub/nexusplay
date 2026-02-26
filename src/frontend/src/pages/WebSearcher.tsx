import { useState, useRef } from 'react';
import { Search, Globe, ExternalLink, ArrowRight } from 'lucide-react';
import type { SearchEngine } from '../hooks/useSettings';

interface WebSearcherProps {
  searchEngine: SearchEngine;
  initialQuery?: string;
}

function getSearchUrl(engine: SearchEngine, query: string): string {
  const encoded = encodeURIComponent(query.trim());
  switch (engine) {
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    case 'google': return `https://www.google.com/search?q=${encoded}`;
    default: return `https://duckduckgo.com/?q=${encoded}&ia=web`;
  }
}

function getHomeUrl(engine: SearchEngine): string {
  switch (engine) {
    case 'bing': return 'https://www.bing.com';
    case 'google': return 'https://www.google.com';
    default: return 'https://duckduckgo.com';
  }
}

const ENGINE_LABELS: Record<SearchEngine, string> = {
  duckduckgo: 'DuckDuckGo',
  bing: 'Bing',
  google: 'Google',
};

const ENGINE_ICONS: Record<SearchEngine, string> = {
  duckduckgo: '🦆',
  bing: '🔷',
  google: '🔍',
};

const QUICK_SUGGESTIONS = [
  'How to code', 'Free games', 'Math help', 'Science facts',
  'History today', 'Latest news', 'Funny videos', 'Study tips',
];

export function WebSearcher({ searchEngine, initialQuery = '' }: WebSearcherProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (!query.trim()) {
      window.open(getHomeUrl(searchEngine), '_blank', 'noopener,noreferrer');
      return;
    }
    window.open(getSearchUrl(searchEngine, query), '_blank', 'noopener,noreferrer');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    window.open(getSearchUrl(searchEngine, s), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-3xl mb-2">
          <Globe className="w-8 h-8 text-neon-cyan" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Web Search</h1>
        <p className="text-sm text-muted-foreground">
          Using {ENGINE_ICONS[searchEngine]} {ENGINE_LABELS[searchEngine]}
        </p>
      </div>

      {/* Search bar */}
      <div className="w-full max-w-2xl mb-4">
        <div className="flex items-center gap-2 bg-card border border-white/10 rounded-2xl px-4 py-3 focus-within:border-neon-cyan/50 transition-colors shadow-lg">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search with ${ENGINE_LABELS[searchEngine]}...`}
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="p-2 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="mt-3 w-full py-3 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-neon-cyan/20 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Search — Opens in New Tab
        </button>
      </div>

      {/* Info banner */}
      <div className="w-full max-w-2xl mb-8 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground text-center">
        Search opens in a new tab. All major search engines (Google, Bing, DuckDuckGo) block being embedded directly in pages — opening in a new tab is the only way they work. Your tab cloak keeps this tab safe!
      </div>

      {/* Quick search suggestions */}
      <div className="w-full max-w-2xl">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 text-center">Quick Searches</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {QUICK_SUGGESTIONS.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => handleSuggestion(s)}
              className="px-3 py-1.5 rounded-full bg-card border border-white/10 text-sm text-foreground hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
