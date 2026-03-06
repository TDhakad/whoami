# tushar-portfolio

Personal portfolio built with **Next.js App Router**, TypeScript, and Tailwind CSS.

## Stack

| Package | Purpose |
|---|---|
| `next` | App Router, SSR/SSG |
| `tailwindcss` | Utility-first styling |
| `framer-motion` | Animations & transitions |
| `next-themes` | Dark / light theme switching |
| `clsx` + `tailwind-merge` | Conditional class merging (`cn()` helper in `src/lib/utils.ts`) |
| `lucide-react` | Icon set |

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/          # Next.js App Router routes & layouts
├── components/   # Shared React components
├── lib/          # Utility functions (e.g. cn() helper)
└── styles/       # Global CSS (globals.css)
```

## Theme Tokens

Color tokens are defined as CSS custom properties in `src/styles/globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}
```

`next-themes` controls the `.dark` class on `<html>` via `attribute="class"`.
Add new tokens under `:root` / `.dark` and reference them via Tailwind's `@theme inline` block.

## Absolute Imports

`@/*` maps to `./src/*` — e.g. `import { cn } from "@/lib/utils"`.
