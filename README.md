# CV Maker

A simple CV builder with live preview, print-ready output, and basic SEO.  
Live: https://cvmaker.efolabessy.app

## Features
- Editor with rich text (bold/italic/lists, color, highlight) via [`Wysiwyg`](app/cvmaker/Wysiwyg.tsx)
- Data persistence using localStorage ("cv-maker") in [`CVMakerPage`](app/cvmaker/page.tsx) and [`Home`](app/page.tsx)
- Link auto-detection (URL/email) on preview in [`Home`](app/page.tsx) via inline linkify
- Print-friendly layout (only CV content, 1-page A4 attempt, clickable links) styled in [app/globals.css](app/globals.css)
- Social links, email, phone rendered as clickable anchors in preview ([`Home`](app/page.tsx))
- SEO: robots + sitemap ([app/robots.ts](app/robots.ts), [app/sitemap.ts](app/sitemap.ts)), metadata in [`metadata`](app/layout.tsx)
 - Social previews: dynamic OG/Twitter images generated via Next OG ([app/opengraph-image.tsx](app/opengraph-image.tsx), [app/twitter-image.tsx](app/twitter-image.tsx))

## Tech stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS (PostCSS) [postcss.config.mjs](postcss.config.mjs)
- ESLint (Next Core Web Vitals) [eslint.config.mjs](eslint.config.mjs)
- Next Image optimization

## App routes
- `/` — Preview of your CV using data from localStorage: [`Home`](app/page.tsx)
- `/cvmaker` — Editor to compose your CV: [`CVMakerPage`](app/cvmaker/page.tsx)
- `/print` — Print-friendly view (reads from localStorage): [app/print](app/print)

## Development
Prereqs: Node.js 18+

```sh
npm install
npm run dev
```

Build and run:
```sh
npm run build
npm start
```

Lint:
```sh
npm run lint
```

## Using the app
1. Open the editor at `/cvmaker` and fill Header, Sections, and Footer.
2. Data auto-saves to localStorage with key "cv-maker".
3. Preview at `/` or use “Print” (header button) to open `/print`.

Reset data:
- Clear browser localStorage key: `cv-maker`.

## Printing / Export to PDF
- Go to `/print` or click “Print” from the header on `/`.
- Use browser Print (Ctrl/Cmd+P), choose “Save as PDF”.
- Page is formatted for A4 with margins and ensures only the CV area is printed.  
  Styles and behaviors are defined under `@media print` in [app/globals.css](app/globals.css).

## SEO
- robots: https://cvmaker.efolabessy.app/robots.txt via [app/robots.ts](app/robots.ts)
- sitemap: https://cvmaker.efolabessy.app/sitemap.xml via [app/sitemap.ts](app/sitemap.ts)
- Global metadata/OpenGraph/Twitter: [`metadata`](app/layout.tsx)
 - Note: The Open Graph route uses a plain `<img>` tag within `next/og` image generation. This is intentional and exempted from the Next.js `no-img-element` ESLint rule in that file.


## Notes
- Images are optimized with `next/image`. Avatar supports Data URL uploads.
- Accessibility: labels/aria on editor controls and sections for better navigation.

## Contributing
Thanks for your interest in contributing! Here’s a short guide to keep things smooth.

### Getting started
1. Fork this repository and clone your fork.
2. Create a feature/bugfix branch from `main` with a descriptive name:
  - `feat/print-centered-layout`
  - `fix/wysiwyg-paste-links`
3. Install dependencies and start the dev server:
  ```pwsh
  npm install
  npm run dev
  ```

### Code style & commits
- TypeScript: use clear types for state/props where helpful.
- Tailwind: keep class names consistent; prefer utility classes over large inline styles.
- Commit messages (concise and descriptive):
  - `feat: add linkify for section content`
  - `fix: center print page and hide navbar`
  - `chore: bump deps and adjust eslint config`

### Lint, build, quick checks
Before pushing:
```pwsh
npm run lint
npm run build
```
Aim for zero errors. Triage warnings when relevant (especially accessibility and Next.js Core Web Vitals).

### Pull Request checklist
- [ ] Clear description and motivation/use case.
- [ ] No unintended breaking changes to public behavior.
- [ ] Manually tested on relevant pages (`/cvmaker`, `/`, and `/print` when applicable).
- [ ] Lint/build pass locally.
- [ ] Screenshots or a short recording for UI changes.

### Good first issues / ideas
- WYSIWYG improvements (hotkeys, paste sanitization, section templates).
- Print themes (minimal, professional, creative) via Tailwind presets.
- Export to DOCX/Markdown in addition to PDF.
- i18n for additional languages.
- Unit tests for utilities (e.g., the linkify function).

If in doubt, open a Discussion/Issue first to align on the plan. Happy contributing!