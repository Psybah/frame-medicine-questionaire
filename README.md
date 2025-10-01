# FRAME Intake Quiz

A mobile‑first, embeddable multi‑step intake quiz for FRAME. Built with React + TypeScript, Vite, Tailwind, and shadcn/ui. Designed to be iframed into a WordPress site, validate responses per card, and submit to Google Sheets via Apps Script.


## Table of Contents

- Overview
- Tech Stack
- Features
- Quiz Flow
- Project Structure
- Getting Started
- Environment Variables
- Google Sheets Integration
- Embedding (WordPress iframe)
- Development Notes (CORS/Proxy)
- Styling & Brand
- Accessibility
- License

## Overview

The app implements a 6‑step (0–5) intake flow with short, high‑conversion cards, a thin progress bar, and brand styling. Answers are validated per card and posted to a Google Sheet through an Apps Script Web App.

## Tech Stack

- React 18 + TypeScript
- Vite 5 (dev server, build)
- Tailwind CSS 3 + tailwindcss-animate
- shadcn/ui + Radix UI primitives
- framer‑motion (CardStack)

## Features

- Multi‑card flow with manual Next/Back controls
- Per‑card validation; cannot advance until required fields are complete
- Progress bar synced to current card
- Brand tokens and colors (`brand`, `brand.secondary`)
- Accessible components from shadcn/ui (inputs, select, checkbox, radio)
- Google Sheets submission via Apps Script

## Quiz Flow

- Step 0: Entry card (logo + Start)
- Step 1: Basics (name, DOB + state (WA/FL/GA/NE/NC), contact)
- Step 2: Health Snapshot (height in inches, weight in lbs, energy, concerns, medical history)
- Step 3: Service Alignment (multi‑select: TRT, ED, Hair, Coaching)
- Step 4: Intake Scheduling (date + preferred contact method)
- Step 5: Confirmation (“What happens next” checklist)

## Project Structure

```
src/
├── components/
│   └── ui/
│       ├── card-stack.tsx        # Motion stack component (retained)
│       ├── demo.tsx              # Quiz content + validation + submit
│       ├── checkbox.tsx, select.tsx, radio-group.tsx, ...
├── pages/
│   ├── Index.tsx                 # Entry with progress bar and trust badge
│   └── NotFound.tsx
├── lib/utils.ts                  # cn() helper
├── index.css                     # Design tokens + Tailwind layers
└── App.tsx, main.tsx
```

## Getting Started

Prereqs: Node 18+

Install and run:

```bash
npm install
npm run dev
# open http://localhost:8080
```

Build/preview:

```bash
npm run build
npm run preview
```

## Environment Variables

Create `.env` with:

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-deployment-id/exec
```

Vite exposes variables that start with `VITE_` at `import.meta.env`.

## Google Sheets Integration

1) Sheet headers (Row 1):

```
firstName, lastName, dob, state, email, phone,
heightInches, weightLbs, energy,
concerns, history, services,
scheduleDate, contactMethod,
createdAt
```

2) Apps Script (Web App) – doPost/doGet/doOptions plus CORS headers; append a row per submission.

3) Deploy as Web app → Execute as: Me; Who has access: Anyone → Deploy. Copy the exec URL into `VITE_GOOGLE_SCRIPT_URL`.

4) Dev Proxy: During local dev we POST to `/api/sheets` and Vite forwards to the Apps Script (avoids browser CORS). In production we post directly to `VITE_GOOGLE_SCRIPT_URL`.

## Embedding (WordPress iframe)

Deploy the app and embed the index route in an iframe:

```html
<iframe src="https://your-domain.com/" width="100%" height="800" style="border:0;" title="FRAME intake"></iframe>
```

## Development Notes

- CORS: Local dev uses Vite proxy → `/api/sheets` → Apps Script host to bypass browser CORS.
- Production: Ensure Apps Script returns `Access-Control-Allow-Origin: *` and redeploy after changes.

## Styling & Brand

- Brand tokens:
  - `--brand-primary: #D86018`
  - `--brand-secondary: #2C5E4C`
- Radios, selects, and checkboxes use brand‑secondary accents
- Card corners: rounded; mobile/desktop width tuned for readability

## Accessibility

- Uses accessible primitives (Radix/shadcn)
- Keyboard‑focus styles and labels via shadcn/ui defaults

## License

Private project. All rights reserved.

