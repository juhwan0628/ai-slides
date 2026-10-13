# AI Slides — Agent Instructions

## Workflow

1. Ask for the presentation's purpose, audience, duration, content and visual preferences if unspecified.
2. Write `projects/<slug>/DESIGN.md` with colors, typography, layout, slide outline and image placements. **Get explicit user approval before creating or editing presentation implementation files.**
3. After approval, implement the design in `projects/<slug>/manifest.json`, `slides.html` and `slides.css`. Reconfirm approval for major design changes.
4. `projects/demo/` is documentation, **not a default design**. Do not copy its colors, text or layouts unless requested.

## Implementation contract

- Edit only `projects/<slug>/` for presentation tasks. Do not change `engine/`, `server/`, other projects or infrastructure without separate authorization.
- Use `<template data-layout="cover|standard|closing">` in `slides.html`; standard slides use `data-title` and `data-section` for master-owned headers.
- Canvas is fixed at **1920×1080 (16:9)**; avoid viewport-dependent content reflow and clipping.
- Place user-supplied images in stable `<div data-image-slot="slot-id" data-alt="description"></div>` elements. Do not rename existing slot IDs or commit uploaded images.
- Keep design-specific CSS in the project. Do not embed secrets or machine-specific paths.

## Completion gate

- Run `SLIDES_URL='http://127.0.0.1:3400/?project=<slug>' npm run verify`; fix reported failures and inspect HTML/PDF visual output. Intentional empty image slots may remain as warnings, but disclose them.
- Run `npm test` when changing the engine, server or shared behavior; it is not required for content-only edits.
- Report what changed, verification status and remaining user review. Never claim untested platform support or push to GitHub without user authorization.
