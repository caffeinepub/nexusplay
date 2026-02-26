import {
  Shield, Eye, Palette, Search, Zap, Check, AlertTriangle, Lock, Cpu,
} from 'lucide-react';
import { TAB_CLOAK_OPTIONS } from '../hooks/useSettings';
import type {
  AppSettings, PanicAction, PanicHotkey, SearchEngine,
  AccentColor, BgTheme, FontSize, TabCloak,
} from '../hooks/useSettings';

interface SettingsPageProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  onLock: () => void;
}

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-neon-purple shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-display font-bold text-lg text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-neon-purple' : 'bg-muted'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export function SettingsPage({ settings, updateSettings, onLock }: SettingsPageProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-8 animate-fade-in">
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Customize your Classroom Games experience</p>
        </div>

        {/* LOCK SCREEN */}
        <section className="bg-card rounded-2xl border border-white/5 p-5">
          <SectionHeader
            icon={<Lock className="w-4 h-4" />}
            title="Lock Screen"
            subtitle="Protect access to Classroom Games"
          />
          <p className="text-sm text-muted-foreground mb-4">
            Lock the app behind the password screen. Anyone with the password can unlock it.
          </p>
          <button
            type="button"
            onClick={onLock}
            className="px-4 py-2 rounded-lg bg-primary/10 text-neon-purple border border-primary/30 text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            Lock Now
          </button>
        </section>

        {/* TAB CLOAK */}
        <section className="bg-card rounded-2xl border border-white/5 p-5">
          <SectionHeader
            icon={<Eye className="w-4 h-4" />}
            title="Tab Cloak"
            subtitle="Change how this tab appears to others"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {TAB_CLOAK_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => updateSettings({ tabCloak: opt.id as TabCloak })}
                className={`
                  relative flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all duration-200
                  ${settings.tabCloak === opt.id
                    ? 'border-primary/60 bg-primary/10 text-neon-purple'
                    : 'border-white/5 bg-background hover:border-primary/30 hover:bg-white/2 text-muted-foreground'
                  }
                `}
              >
                <img
                  src={opt.favicon}
                  alt=""
                  className="w-5 h-5 object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs font-medium leading-tight">{opt.label}</span>
                {settings.tabCloak === opt.id && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-neon-purple flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* PANIC MODE */}
        <section className="bg-card rounded-2xl border border-white/5 p-5">
          <SectionHeader
            icon={<Shield className="w-4 h-4" />}
            title="Panic Mode"
            subtitle="Quickly escape when someone looks at your screen"
          />

          <div className="space-y-4">
            {/* Enable toggle */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-sm font-medium text-foreground">Enable Panic Mode</p>
                <p className="text-xs text-muted-foreground">Activates the hotkey listener</p>
              </div>
              <Toggle enabled={settings.panicEnabled} onChange={() => updateSettings({ panicEnabled: !settings.panicEnabled })} />
            </div>

            {settings.panicEnabled && (
              <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Panic mode is active -- hotkey will trigger immediately
              </div>
            )}

            {/* Action */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Panic Action</p>
              <div className="space-y-2">
                {([
                  { value: 'redirect-google', label: 'Redirect to Google', desc: 'Opens google.com' },
                  { value: 'redirect-classroom', label: 'Redirect to Google Classroom', desc: 'Opens classroom.google.com' },
                  { value: 'custom-url', label: 'Redirect to Custom URL', desc: 'Opens your chosen URL' },
                  { value: 'close-tab', label: 'Close Tab', desc: 'Attempts to close the tab (may redirect to Google)' },
                ] as Array<{ value: PanicAction; label: string; desc: string }>).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateSettings({ panicAction: opt.value })}
                    className={`
                      w-full text-left p-3 rounded-lg border transition-all duration-200
                      ${settings.panicAction === opt.value
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/5 bg-background hover:border-primary/20'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border-2 ${settings.panicAction === opt.value ? 'border-neon-purple bg-neon-purple' : 'border-muted-foreground'}`} />
                      <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-5 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL field */}
            {settings.panicAction === 'custom-url' && (
              <div>
                <label htmlFor="panic-custom-url" className="block text-sm font-medium text-foreground mb-1">Custom Redirect URL</label>
                <input
                  id="panic-custom-url"
                  type="url"
                  value={settings.panicCustomUrl}
                  onChange={(e) => updateSettings({ panicCustomUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}

            {/* Hotkey */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Hotkey</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'escape2', label: 'Esc x 2', desc: 'Double-tap Escape' },
                  { value: 'f12', label: 'F12', desc: 'F12 key' },
                  { value: 'ctrl-q', label: 'Ctrl+Q', desc: 'Ctrl + Q' },
                ] as Array<{ value: PanicHotkey; label: string; desc: string }>).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateSettings({ panicHotkey: opt.value })}
                    className={`
                      px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200
                      ${settings.panicHotkey === opt.value
                        ? 'border-primary/60 bg-primary/15 text-neon-purple'
                        : 'border-white/10 bg-background text-muted-foreground hover:border-primary/30'
                      }
                    `}
                    title={opt.desc}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Current: <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">{
                  settings.panicHotkey === 'escape2' ? 'Esc Esc' :
                  settings.panicHotkey === 'f12' ? 'F12' : 'Ctrl+Q'
                }</kbd>
              </p>
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="bg-card rounded-2xl border border-white/5 p-5">
          <SectionHeader
            icon={<Palette className="w-4 h-4" />}
            title="Appearance"
            subtitle="Customize the look and feel"
          />

          <div className="space-y-5">
            {/* Background */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Background Theme</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'dark', label: 'Dark', color: '#0a0a0f' },
                  { value: 'midnight-blue', label: 'Midnight Blue', color: '#050a1a' },
                  { value: 'deep-green', label: 'Deep Green', color: '#030f0a' },
                  { value: 'charcoal', label: 'Charcoal', color: '#111111' },
                ] as Array<{ value: BgTheme; label: string; color: string }>).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateSettings({ bgTheme: opt.value })}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200
                      ${settings.bgTheme === opt.value
                        ? 'border-primary/60 bg-primary/10 text-foreground'
                        : 'border-white/5 bg-background text-muted-foreground hover:border-primary/20'
                      }
                    `}
                  >
                    <span className="w-4 h-4 rounded border border-white/20" style={{ background: opt.color }} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Accent Color</p>
              <div className="flex flex-wrap gap-2">
                {([
                  { value: 'purple', label: 'Purple', bg: 'bg-purple-500' },
                  { value: 'cyan', label: 'Cyan', bg: 'bg-cyan-400' },
                  { value: 'orange', label: 'Orange', bg: 'bg-orange-500' },
                  { value: 'green', label: 'Green', bg: 'bg-green-500' },
                ] as Array<{ value: AccentColor; label: string; bg: string }>).map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => updateSettings({ accentColor: opt.value })}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-200
                      ${settings.accentColor === opt.value
                        ? 'border-primary/60 bg-primary/10 text-foreground'
                        : 'border-white/5 bg-background text-muted-foreground hover:border-primary/20'
                      }
                    `}
                  >
                    <span className={`w-3 h-3 rounded-full ${opt.bg}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Font Size</p>
              <div className="flex gap-2">
                {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`
                      px-4 py-2 rounded-lg border text-sm capitalize transition-all duration-200
                      ${settings.fontSize === size
                        ? 'border-primary/60 bg-primary/10 text-neon-purple'
                        : 'border-white/5 bg-background text-muted-foreground hover:border-primary/20'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH ENGINE */}
        <section className="bg-card rounded-2xl border border-white/5 p-5">
          <SectionHeader
            icon={<Search className="w-4 h-4" />}
            title="Search Engine"
            subtitle="Used in the Web Searcher"
          />
          <div className="space-y-2">
            {([
              { value: 'duckduckgo', label: 'DuckDuckGo', desc: 'Privacy-focused search (recommended)', works: true },
              { value: 'bing', label: 'Bing', desc: 'Microsoft search engine', works: true },
              { value: 'google', label: 'Google', desc: 'May not work due to iframe restrictions', works: false },
            ] as Array<{ value: SearchEngine; label: string; desc: string; works: boolean }>).map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => updateSettings({ searchEngine: opt.value })}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all duration-200
                  ${settings.searchEngine === opt.value
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-white/5 bg-background hover:border-primary/20'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 ${settings.searchEngine === opt.value ? 'border-neon-cyan bg-neon-cyan' : 'border-muted-foreground'}`} />
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  {!opt.works && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-medium">
                      May not work
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground ml-5 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ADVANCED */}
        <section className="bg-card rounded-2xl border border-white/5 p-5">
          <SectionHeader
            icon={<Cpu className="w-4 h-4" />}
            title="Advanced"
            subtitle="Extra customization options"
          />
          <div className="space-y-4">
            {/* Animations */}
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-sm font-medium text-foreground">Animations</p>
                <p className="text-xs text-muted-foreground">Enable UI transitions and effects</p>
              </div>
              <Toggle enabled={settings.animations} onChange={() => updateSettings({ animations: !settings.animations })} />
            </div>
            {/* Sidebar Icons Only */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">Sidebar Icons Only</p>
                <p className="text-xs text-muted-foreground">Collapse the sidebar to icons only</p>
              </div>
              <Toggle enabled={settings.sidebarIconsOnly} onChange={() => updateSettings({ sidebarIconsOnly: !settings.sidebarIconsOnly })} />
            </div>
          </div>
        </section>

        {/* RESET */}
        <section className="bg-card rounded-2xl border border-destructive/20 p-5">
          <SectionHeader
            icon={<Zap className="w-4 h-4" />}
            title="Reset Settings"
            subtitle="Restore all settings to defaults"
          />
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('classroomgames_settings');
              localStorage.removeItem('classroomgames_recent');
              localStorage.removeItem('nexusplay_settings');
              localStorage.removeItem('nexusplay_recent');
              window.location.reload();
            }}
            className="px-4 py-2 rounded-lg bg-destructive/10 text-red-400 border border-destructive/30 text-sm font-semibold hover:bg-destructive/20 transition-colors"
          >
            Reset All Settings
          </button>
        </section>

        <footer className="text-center py-4 text-xs text-muted-foreground">
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-neon-purple transition-colors">
            Built with caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
