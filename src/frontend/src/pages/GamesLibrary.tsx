import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { GAMES, CATEGORY_LABELS } from '../data/games';
import { GameCard } from '../components/GameCard';
import type { Game, Category } from '../data/games';

interface GamesLibraryProps {
  onPlayGame: (game: Game) => void;
}

type CategoryFilter = 'all' | Category;

const CATEGORIES: CategoryFilter[] = ['all', 'action', 'shooting', 'racing', 'puzzle', 'io', 'arcade', 'sports', 'adventure', 'strategy'];

export function GamesLibrary({ onPlayGame }: GamesLibraryProps) {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = GAMES;
    if (category !== 'all') list = list.filter((g) => g.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) => g.name.toLowerCase().includes(q) || g.description?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, search]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 animate-fade-in">

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display font-bold text-3xl text-foreground">Game Library</h1>
          <p className="text-muted-foreground text-sm mt-1">{GAMES.length} games available</p>
        </div>

        {/* Search + Filter row */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-white/5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:block">{filtered.length} found</span>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${category === cat
                  ? 'bg-primary/20 text-neon-purple border border-primary/40'
                  : 'bg-card text-muted-foreground border border-white/5 hover:border-primary/20 hover:text-foreground'
                }
              `}
            >
              {CATEGORY_LABELS[cat] ?? 'All'}
            </button>
          ))}
        </div>

        {/* Game grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No games found</p>
            <p className="text-sm mt-1">Try a different category or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} onPlay={onPlayGame} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
