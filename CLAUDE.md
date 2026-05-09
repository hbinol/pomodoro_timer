# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**After every commit, update this file** to reflect any changes to architecture, commands, or design decisions made in that commit.

## Project

**Penguin Focus** — a gamified Pomodoro timer (web app) where a penguin character travels across the Arctic as focus sessions are completed. See `spec.md` for the full product spec.

Tech stack: **Next.js · Tailwind CSS · Lucide-React**

## Commands

Once the Next.js project is scaffolded:

```bash
npm run dev       # start dev server (localhost:3000)
npm run build     # production build
npm run lint      # ESLint
npm run typecheck # tsc --noEmit (if configured)
```

## Architecture

This is a Sprint 1 MVP — single-page Next.js app with no backend.

**Core state** lives in a single timer component (or a custom `usePomodoro` hook):
- Timer phase: `focus` (25 min) | `break` (5 min)
- Elapsed seconds
- Trip progress (sessions completed → penguin position along the map)

**Persistence**: `localStorage` only — no server, no auth.

**Sound**: Web Audio API or a small `.mp3` asset triggered on session completion.

## Design System

- Palette: soft Arctic blues, whites, frosted glass (glassmorphism via `backdrop-blur` + semi-transparent backgrounds)
- Feel: calm, minimalist — avoid heavy shadows or high-contrast accents
- Penguin movement should be animated (CSS transition or Framer Motion) along a horizontal progress bar/map
