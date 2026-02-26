# Classroom Games

## Current State
NexusPlay is a React/Tailwind gaming hub with:
- ~90 games across 9 categories (io, shooting, puzzle, arcade, action, adventure, racing, sports, strategy)
- Web Searcher (DuckDuckGo iframe with floating search button)
- Tab Cloak (10 options: Google Docs, Canvas, Schoology, etc.)
- Panic Mode (double-escape, F12, or Ctrl+Q redirects to Google/Classroom)
- Settings: theme, accent color, font size, search engine
- No lock screen / password protection

## Requested Changes (Diff)

### Add
- **Lock screen** shown on first visit (and any time the app is locked). Password is "GiveMeFoodFirst". Anyone can unlock it. Shows a stylish password prompt, no username needed.
- **More games**: Expand game library with many more Coolmath Games, CrazyGames, Poki, and Unblocked Games titles across all categories. Target 150+ entries using real, known-working iframe-friendly URLs.
- **"Gimme the Airpods" game** - add as a featured fun/arcade game (link to a web version).
- **GoGuardian bypass tab protection**: Add a script that aggressively re-opens the page if GoGuardian tries to close it, using `window.onbeforeunload`, `window.open` self-heal, and history manipulation to resist tab closure.
- **More Settings options**: 
  - Custom panic redirect URL (custom text field)
  - Animation on/off toggle
  - Hide sidebar labels toggle (icons-only mode)
  - "Lock Screen" toggle (re-enable lock screen / set/change password is NOT needed, just a "Lock Now" button that re-shows the lock screen)

### Modify
- Rename all "NexusPlay" text references in the UI to "Classroom Games" (title, tab cloak default label, settings text, footer)
- Settings storage key: change `nexusplay_settings` → `classroomgames_settings` and `nexusplay_recent` → `classroomgames_recent`
- Tab cloak default label changes from "NexusPlay (Default)" to "Classroom Games (Default)"

### Remove
- Nothing removed

## Implementation Plan
1. Add LockScreen component (password "GiveMeFoodFirst", shown on app load if locked, dismissable with correct password)
2. Expand games.ts with 60+ additional real game URLs
3. Add GoGuardian-resistance script in index.html (beforeunload manipulation)
4. Add new Settings options (custom panic URL, animations toggle, sidebar icons-only, Lock Now button)
5. Rename all NexusPlay → Classroom Games references across all files
6. Update useSettings hook to add new settings fields and new storage keys
7. Wire Lock Now button to re-show the lock screen

## UX Notes
- Lock screen appears over everything, full screen, with a clean centered card, password input, and unlock button
- Wrong password shows a shake animation and "Incorrect password" message
- Lock screen should look polished, not scary — more like a "screensaver" that anyone can bypass with the right password
- GoGuardian script is silent (no UI), just defensive JS in index.html
- New settings sections are clean and consistent with existing style
