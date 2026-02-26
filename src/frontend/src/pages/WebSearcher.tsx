import { useState, useRef, useEffect } from 'react';
import { Search, Globe, X } from 'lucide-react';
import type { SearchEngine } from '../hooks/useSettings';

interface WebSearcherProps {
  searchEngine: SearchEngine;
  initialQuery?: string;
}

function getSearchUrl(engine: SearchEngine, query: string): string {
  if (!query.trim()) {
    switch (engine) {
      case 'bing': return 'https://www.bing.com';
      case 'google': return 'https://www.google.com';
      default: return 'https://duckduckgo.com';
    }
  }
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    case 'google': return `https://www.google.com/search?q=${encoded}`;
    default: return `https://duckduckgo.com/?q=${encoded}&ia=web`;
  }
}

const ENGINE_LABELS: Record<SearchEngine, string> = {
  duckduckgo: 'DuckDuckGo',
  bing: 'Bing',
  google: 'Google (may not work)',
};

export function WebSearcher({ searchEngine, initialQuery = '' }: WebSearcherProps) {
  const [query, setQuery] = useState(initialQuery);
  const [currentUrl, setCurrentUrl] = useState(() => getSearchUrl(searchEngine, initialQuery));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setCurrentUrl(getSearchUrl(searchEngine, initialQuery));
    }
  }, [initialQuery, searchEngine]);

  const handleSearch = () => {
    setCurrentUrl(getSearchUrl(searchEngine, query));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      {/* Search bar - sticky */}
      <div className="shrink-0 px-4 md:px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <Globe className="w-5 h-5 text-neon-cyan shrink-0" />
          <div className="flex-1 flex items-center gap-2 bg-card border border-white/5 rounded-xl px-4 py-2 focus-within:border-neon-cyan/40 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Search with ${ENGINE_LABELS[searchEngine]}...`}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 text-sm font-semibold hover:bg-neon-cyan/20 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
        {searchEngine === 'google' && (
          <p className="text-center text-xs text-yellow-400/70 mt-2">
            Note: Google blocks iframe embedding. Results may not load.
          </p>
        )}
      </div>

      {/* iframe */}
      <div className="flex-1 relative">
        <iframe
          key={currentUrl}
          src={currentUrl}
          title="Web Search"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-navigation"
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/20 pointer-events-none bg-black/30 px-3 py-1 rounded-full">
          {currentUrl}
        </div>
      </div>
    </div>
  );
}
