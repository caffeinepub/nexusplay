import { Gamepad2, Home, Library, Search, Settings, Zap } from 'lucide-react';
import type { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  iconsOnly?: boolean;
}

const NAV_ITEMS: Array<{ page: Page; icon: React.ReactNode; label: string }> = [
  { page: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
  { page: 'library', icon: <Library className="w-5 h-5" />, label: 'Library' },
  { page: 'search', icon: <Search className="w-5 h-5" />, label: 'Web Search' },
  { page: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
];

export function Sidebar({ currentPage, onNavigate, iconsOnly = false }: SidebarProps) {
  const collapsed = iconsOnly;

  return (
    <aside className={`nexus-sidebar flex flex-col shrink-0 h-full ${collapsed ? 'w-16' : 'w-16 md:w-60'}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 md:px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 animate-pulse-glow">
          <Zap className="w-5 h-5 text-neon-purple" />
        </div>
        {!collapsed && (
          <div className="hidden md:block">
            <div className="font-display font-bold text-lg text-gradient-purple leading-none">Classroom Games</div>
            <div className="text-xs text-muted-foreground mt-0.5">Gaming Hub</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 md:px-3 space-y-1">
        {NAV_ITEMS.map(({ page, icon, label }) => {
          const isActive = currentPage === page;
          return (
            <button
              type="button"
              key={page}
              onClick={() => onNavigate(page)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                ${isActive
                  ? 'bg-primary/20 text-neon-purple border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                }
              `}
              aria-label={label}
            >
              <span className={`shrink-0 ${isActive ? 'text-neon-purple' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {icon}
              </span>
              {!collapsed && (
                <span className="hidden md:block font-medium text-sm">{label}</span>
              )}
              {isActive && !collapsed && (
                <div className="hidden md:block ml-auto w-1.5 h-1.5 rounded-full bg-neon-purple" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-white/5">
        {!collapsed && (
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>150+ Games</span>
          </div>
        )}
        <div className={`${collapsed ? 'flex' : 'md:hidden'} justify-center`}>
          <Gamepad2 className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
}
