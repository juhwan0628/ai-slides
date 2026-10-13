# AI Slides — coding agent contract

## Before implementation

1. Obtain the purpose, audience, duration, content, visual direction and image requirements.
2. Create `projects/<slug>/DESIGN.md` defining the palette, typography, grid, slide-by-slide storyboard and acceptance criteria. Show it to the user.
3. **Wait for explicit design approval before writing or altering `slides.html`, `slides.css` or `manifest.json`.** Re-approve substantial design changes.
4. The `projects/demo` sample is a tutorial, **not** a template or style to inherit.

## Build only within the approved project

- Modify `projects/<slug>/DESIGN.md`, `manifest.json`, `slides.html` and `slides.css`. Do not change `engine/`, `server/`, nginx or unrelated projects for design edits.
- Use `<template data-layout="cover|standard|closing">` for each slide. `standard` has master-owned `data-title` and `data-section`; only put slide-body content inside it. See the existing example and `server/app.js` parser.
- Use fixed 1920×1080 logical coordinates (16:9). The viewer scales the whole canvas uniformly; never reflow it based on viewport size.
- Never inherit colors, elements or wording from the example unless the user explicitly chooses them. Theme-specific styling belongs in the project's stylesheet; optional `manifest.theme` exposes a namespaced frame attribute.
- For images, declare stable IDs: `<div data-image-slot="unique-id" data-alt="description"></div>`. Keep IDs stable across revisions. Images use `object-fit: contain` by default. Uploading/replacing images is a human browser action, not an AI modification of assets.
- Do not embed private images, API keys, credentials or host-specific paths. Ignore `projects/*/assets/`, `cache/`, `artifacts/` and `node_modules/`.
- Runtime: Node >=20. PDF and browser use the same `engine/render.js` master, locally installed Noto Sans KR Variable, and 1920×1080 geometry. Do not compromise print/browser parity.

## Verify, then report

1. Start locally with `npm run dev:local` for image uploads (trusted loopback workstation only). Use `npm run dev` for read-only preview.
2. Run `npm test` with `TEST_PROJECT=<slug>` as needed. Tests check navigation, layout, images, fonts and PDF caching.
3. Run `SLIDES_URL='http://127.0.0.1:3400/?project=<slug>' npm run verify`. Inspect `artifacts/m5/report.json`, screenshots and the **real downloaded PDF** rendered to PNG. Failures block completion; missing intentional image slots are warnings.
4. Check page count, text overflow, PDF fonts, stable image slots and the actual deployed preview if applicable. Do not claim macOS/Windows validation without running it on those platforms.
5. Clearly distinguish source edit, test results, public deployment status, and what remains for human review. Do not push to GitHub without permission.

## Security

The default local server binds `127.0.0.1`. Production reverse proxies must block unauthenticated write requests. `AI_SLIDES_ALLOWED_ORIGINS` is an optional comma-separated allowlist for trusted deployments; it is not upload authentication. Never expose `AI_SLIDES_LOCAL_UPLOAD=1` on a public listener.
