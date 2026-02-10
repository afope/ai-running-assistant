## adi running assistant

adi running assistant is an adidas‑inspired running coach ui built with **next.js (app router)** and the **vercel ai sdk**.  
it helps runners with pace calculations, training zones, and race‑time predictions, with tool‑calling powered by anthropic.

### features

- **chat interface** with `useChat` from `@ai-sdk/react`
- **ai tools** defined in `app/actions.ts`:
  - `calculatePace` – calculates pace per km from distance and time
  - `suggestTrainingZones` – builds pace training zones from threshold pace
- **streaming responses** via `app/api/chat/route.ts` and `streamText`
- **custom adidas‑style ui**:
  - adi font using `localFont` in `app/layout.tsx`
  - horizontal three‑stripe accents
  - centered input bar and tool result cards (`app/page.tsx`)
- **light/dark mode friendly** using tailwind (v4) utilities

### getting started (local)

1. **install dependencies**

```bash
pnpm install
```

2. **set environment variables**

create a `.env.local` file in the project root:

```bash
ANTHROPIC_API_KEY=your_anthropic_key_here
```

3. **run the dev server**

```bash
pnpm dev
```

open `http://localhost:3000` in your browser.

### project structure

- `app/layout.tsx` – root layout, global fonts, and metadata
- `app/page.tsx` – main chat ui and adidas‑inspired layout
- `app/actions.ts` – ai tools (`calculatePace`, `suggestTrainingZones`)
- `app/api/chat/route.ts` – chat api using `streamText` + anthropic
- `app/components/MarkdownText.tsx` – lightweight markdown renderer for ai responses
- `app/fonts/` – adi font files (`adineuePRO-Regular.otf`, etc.)
- `app/globals.css` – tailwind + css variables, global typography

### deployment

the app is a standard next.js project and is easiest to deploy on **vercel**:

1. push this repo to github/gitlab/bitbucket.
2. in vercel, create a new project and import the repo.
3. set the environment variable `ANTHROPIC_API_KEY` in the vercel dashboard.
4. deploy – vercel will run `next build` and host the app.

for self‑hosting:

```bash
pnpm install
pnpm build
pnpm start
```

make sure `ANTHROPIC_API_KEY` is set in the environment on your server.
