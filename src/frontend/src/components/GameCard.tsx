import { Play, Gamepad2 } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../data/games';
import type { Game } from '../data/games';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  compact?: boolean;
}

const THUMB_GRADIENTS = [
  'from-purple-900 to-indigo-900',
  'from-cyan-900 to-blue-900',
  'from-red-900 to-orange-900',
  'from-green-900 to-teal-900',
  'from-yellow-900 to-amber-900',
  'from-pink-900 to-rose-900',
];

function getGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return THUMB_GRADIENTS[Math.abs(hash) % THUMB_GRADIENTS.length];
}

function getInitials(name: string): string {
  return name
    .split(/[\s.]+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function GameCard({ game, onPlay, compact = false }: GameCardProps) {
  const gradient = getGradient(game.id);
  const initials = getInitials(game.name);
  const categoryColor = CATEGORY_COLORS[game.category] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/30';

  if (compact) {
    return (
      <div
        className="group relative rounded-lg overflow-hidden border border-white/5 bg-card card-hover-glow cursor-pointer"
        onClick={() => onPlay(game)}
      >
        <div className={`h-20 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="font-display font-bold text-xl text-white/80">{initials}</span>
        </div>
        <div className="p-2">
          <p className="text-xs font-medium text-foreground truncate">{game.name}</p>
        </div>
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl overflow-hidden border border-white/5 bg-card card-hover-glow flex flex-col">
      {/* Thumbnail */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-grid-pattern" />
        <span className="font-display font-bold text-4xl text-white/70 select-none">{initials}</span>
        <Gamepad2 className="absolute bottom-2 right-2 w-4 h-4 text-white/30" />
        {game.featured && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-neon-purple text-white uppercase tracking-wider">
            Featured
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-1">
          <h3 className="font-display font-semibold text-sm text-foreground leading-tight line-clamp-1">
            {game.name}
          </h3>
          <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border ${categoryColor} font-medium`}>
            {CATEGORY_LABELS[game.category]}
          </span>
        </div>
        {game.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{game.description}</p>
        )}
        <button
          onClick={() => onPlay(game)}
          className="mt-auto w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/20 text-neon-purple border border-primary/30 hover:bg-primary/30 hover:border-primary/60 transition-all duration-200 group-hover:bg-primary/30"
        >
          <Play className="w-3 h-3" />
          Play Now
        </button>
      </div>
    </div>
  );
}
