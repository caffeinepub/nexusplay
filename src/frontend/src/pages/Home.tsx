import { useState, useMemo } from 'react';
import { Search, Clock, Star, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { GAMES, CATEGORY_COLORS, CATEGORY_LABELS } from '../data/games';
import { GameCard } from '../components/GameCard';
import type { Game } from '../data/games';
import type { Page } from '../App';

interface HomeProps {
  onPlayGame: (game: Game) => void;
  recent: Game[];
  onNavigate: (page: Page) => void;
}

const FEATURED = GAMES.filter((g) => g.featured).slice(0, 5);
const TOP_GAMES = GAMES.slice(0, 12);

export function Home({ onPlayGame, recent, onNavigate }: HomeProps) {
  const [search, setSearch] = useState('');
  const [carouselIdx, setCarouselIdx] = useState(0);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return GAMES.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [search]);

  const featured = FEATURED[carouselIdx % FEATURED.length];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 100+ games..."
            className="w-full pl-11 pr-4 py-3 bg-card border border-white/5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Search results */}
        {search.trim() && (
          <div>
            <h2 className="font-display font-bold text-lg text-foreground mb-3">
              Results for "{search}" ({searchResults.length})
            </h2>
            {searchResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No games found</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {searchResults.map((game) => (
                  <GameCard key={game.id} game={game} onPlay={onPlayGame} compact />
                ))}
              </div>
            )}
          </div>
        )}

        {!search.trim() && (
          <>
            {/* Featured Carousel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-neon-purple" />
                  <h2 className="font-display font-bold text-xl text-foreground">Featured Games</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCarouselIdx((i) => (i - 1 + FEATURED.length) % FEATURED.length)}
                    className="p-1.5 rounded-lg border border-white/5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCarouselIdx((i) => (i + 1) % FEATURED.length)}
                    className="p-1.5 rounded-lg border border-white/5 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-card h-48 md:h-64 group cursor-pointer"
                onClick={() => onPlayGame(featured)}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-indigo-900/40 to-cyan-900/40" />
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="relative z-10 flex flex-col justify-end p-6 h-full">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${CATEGORY_COLORS[featured.category] ?? ''} font-semibold mb-2 inline-block`}>
                        {CATEGORY_LABELS[featured.category]}
                      </span>
                      <h3 className="font-display font-bold text-3xl text-white">{featured.name}</h3>
                      <p className="text-sm text-white/60 mt-1">{featured.description}</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/80 text-white font-semibold text-sm hover:bg-primary transition-colors shadow-neon-purple">
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                  </div>
                  <div className="flex gap-1.5 mt-4">
                    {FEATURED.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setCarouselIdx(i); }}
                        className={`h-1.5 rounded-full transition-all duration-200 ${i === carouselIdx % FEATURED.length ? 'w-6 bg-neon-purple' : 'w-1.5 bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recently Played */}
            {recent.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-neon-cyan" />
                  <h2 className="font-display font-bold text-xl text-foreground">Recently Played</h2>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {recent.map((game) => (
                    <div key={game.id} className="shrink-0 w-28">
                      <GameCard game={game} onPlay={onPlayGame} compact />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Games grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-xl text-foreground">Top Games</h2>
                <button
                  onClick={() => onNavigate('library')}
                  className="text-sm text-neon-purple hover:text-neon-cyan transition-colors"
                >
                  View all →
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {TOP_GAMES.map((game) => (
                  <GameCard key={game.id} game={game} onPlay={onPlayGame} compact />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
