import { useState, useRef, useEffect } from 'react';
import { Search, Globe, ArrowRight, RefreshCw, Home } from 'lucide-react';
import type { SearchEngine } from '../hooks/useSettings';

interface WebSearcherProps {
  searchEngine: SearchEngine;
  initialQuery?: string;
}

// Public SearXNG instances that allow embedding (X-Frame-Options: ALLOWALL or none)
const SEARXNG_INSTANCES = [
  'https://searx.be',
  'https://search.inetol.net',
  'https://search.mdosch.de',
];

function getEmbedUrl(engine: SearchEngine, query: string): string {
  const encoded = encodeURIComponent(query.trim());
  if (!query.trim()) {
    return `${SEARXNG_INSTANCES[0]}`;
  }
  // SearXNG supports all engines via its metasearch
  switch (engine) {
    case 'google':
      return `${SEARXNG_INSTANCES[0]}/?q=${encoded}&engines=google`;
    case 'bing':
      return `${SEARXNG_INSTANCES[0]}/?q=${encoded}&engines=bing`;
    default:
      return `${SEARXNG_INSTANCES[0]}/?q=${encoded}&engines=duckduckgo`;
  }
}

const ENGINE_LABELS: Record<SearchEngine, string> = {
  duckduckgo: 'DuckDuckGo',
  bing: 'Bing',
  google: 'Google',
};

export function WebSearcher({ searchEngine, initialQuery = '' }: WebSearcherProps) {
  const [query, setQuery] = useState(initialQuery);
  const [iframeUrl, setIframeUrl] = useState(() =>
    initialQuery ? getEmbedUrl(searchEngine, initialQuery) : SEARXNG_INSTANCES[0]
  );
  const [loading, setLoading] = useState(true);
  const [instanceIdx, setInstanceIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setIframeUrl(getEmbedUrl(searchEngine, initialQuery));
    }
  }, [initialQuery, searchEngine]);

  const handleSearch = () => {
    const url = query.trim()
      ? getEmbedUrl(searchEngine, query)
      : SEARXNG_INSTANCES[instanceIdx];
    setIframeUrl(url);
    setLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleRefresh = () => {
    setLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeUrl;
    }
  };

  const handleHome = () => {
    setQuery('');
    setIframeUrl(SEARXNG_INSTANCES[instanceIdx]);
    setLoading(true);
  };

  const tryNextInstance = () => {
    const next = (instanceIdx + 1) % SEARXNG_INSTANCES.length;
    setInstanceIdx(next);
    const url = query.trim()
      ? `${SEARXNG_INSTANCES[next]}/?q=${encodeURIComponent(query.trim())}`
      : SEARXNG_INSTANCES[next];
    setIframeUrl(url);
    setLoading(true);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search bar toolbar */}
      <div className="shrink-0 px-4 py-2 border-b border-white/10 bg-card/50 backdrop-blur-sm flex items-center gap-2">
        <button
          type="button"
          onClick={handleHome}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title="Home"
        >
          <Home className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-background border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-neon-cyan/50 transition-colors">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search with ${ENGINE_LABELS[searchEngine]}... (powered by SearXNG)`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="p-1 rounded-lg text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-3 py-1.5 rounded-xl bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 text-xs font-semibold flex items-center gap-1.5 hover:bg-neon-cyan/20 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </div>

      {/* Iframe browser */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 gap-3">
            <div className="w-8 h-8 border-2 border-neon-cyan/30 border-t-neon-cyan rounded-full animate-spin" />
            <p className="text-xs text-muted-foreground">Loading search engine...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={iframeUrl}
          className="w-full h-full border-0"
          title="Web Search"
          onLoad={() => setLoading(false)}
          onError={tryNextInstance}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
        {/* Fallback overlay if iframe fails */}
        {!loading && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={tryNextInstance}
              className="px-2.5 py-1 rounded-lg bg-card border border-white/10 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Try different server
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
