# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**After every commit, update this file** to reflect any changes to architecture, commands, or design decisions made in that commit.

## Project

**Penguin Focus** — a gamified Pomodoro timer (web app) where a penguin character travels across the Arctic as focus sessions are completed. See `spec.md` for the full product spec.

Tech stack: **Next.js · Tailwind CSS · Lucide-React**

## Commands

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run lint      # ESLint
```

## Architecture

Single-page Next.js App Router app (`app/page.tsx`) with no backend.

**Core state** lives in `components/PomodoroTimer.tsx` via a `usePomodoro` hook:
- Timer phase: `focus` (25 min) | `break` (5 min)
- Elapsed seconds
- Trip progress (sessions completed → penguin position along the map)

**Persistence**: `localStorage` only — no server, no auth.

**Sound**: Web Audio API triggered on session completion.

## Design System

- Palette: soft Arctic blues, whites, frosted glass (glassmorphism via `backdrop-blur` + semi-transparent backgrounds)
- Feel: calm, minimalist — avoid heavy shadows or high-contrast accents
- Penguin movement animated (CSS transition) along a horizontal progress bar/map
