import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import type { SearchEngine } from '../hooks/useSettings';

interface FloatingSearchProps {
  searchEngine: SearchEngine;
  onOpenSearchPage?: (query: string) => void;
}

function getSearchUrl(engine: SearchEngine, query: string): string {
  const encoded = encodeURIComponent(query);
  switch (engine) {
    case 'bing': return `https://www.bing.com/search?q=${encoded}`;
    case 'google': return `https://www.google.com/search?q=${encoded}`;
    default: return `https://duckduckgo.com/?q=${encoded}&ia=web`;
  }
}

export function FloatingSearch({ searchEngine, onOpenSearchPage }: FloatingSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSearch = () => {
    if (!query.trim()) return;
    if (onOpenSearchPage) {
      onOpenSearchPage(query.trim());
      setOpen(false);
      setQuery('');
    } else {
      window.open(getSearchUrl(searchEngine, query.trim()), '_blank');
      setOpen(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-fade-in bg-nexus-card border border-white/10 rounded-xl shadow-xl p-3 w-72">
          <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 border border-white/10 focus-within:border-neon-purple/50 transition-colors">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search the web..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground px-1">
            <span>Engine: {searchEngine}</span>
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="px-3 py-1 rounded-lg bg-primary/20 text-neon-purple border border-primary/30 hover:bg-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200
          ${open
            ? 'bg-neon-purple text-white shadow-neon-purple'
            : 'bg-nexus-card border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:shadow-neon-purple'
          }
        `}
        aria-label={open ? 'Close search' : 'Open search'}
      >
        {open ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
      </button>
    </div>
  );
}
