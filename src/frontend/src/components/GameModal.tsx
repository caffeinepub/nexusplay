import { X, ExternalLink, AlertCircle, Maximize2 } from 'lucide-react';
import type { Game } from '../data/games';

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
}

export function GameModal({ game, onClose }: GameModalProps) {
  if (!game) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-nexus-darker animate-fade-in">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-nexus-card border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-lg text-foreground">{game.name}</span>
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-neon-cyan transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-3 h-3" />
            Open in new tab
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Some games may not embed
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Close game"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 relative">
        <iframe
          src={game.url}
          title={game.name}
          className="w-full h-full border-0"
          allow="fullscreen; gamepad; autoplay"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
        />
        {/* Keyboard shortcut hint */}
        <div className="absolute bottom-4 right-4 text-xs text-white/30 bg-black/40 px-2 py-1 rounded pointer-events-none">
          Press ESC to close
        </div>
      </div>
    </div>
  );
}
