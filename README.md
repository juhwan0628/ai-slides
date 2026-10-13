# AI Slides

**AI-first HTML presentation engine for VS Code agents.** AI writes slides; you approve the design and review the output. The browser provides previews, image slots and PDF export — not a drag-and-drop editor.

## Quick start

Requirements: Node.js 20+ and npm. Open the cloned repository in VS Code.

```bash
git clone https://github.com/juhwan0628/ai-slides.git
cd ai-slides
npm ci
npm run setup:browser
npm run dev:local
```

Open **http://127.0.0.1:3400/?project=demo**. It is a six-slide usage tutorial with its approved example design in [`projects/demo/DESIGN.md`](projects/demo/DESIGN.md).

`npm run dev:local` starts the loopback-only browser app with image insertion/replacement enabled. **Do not expose this mode to the network or internet.** Open `http://127.0.0.1:3400/?project=demo` to preview the example. For a read-only preview, use `npm run dev` instead. No nginx, domain, VPS or hosted service is required for local use.

## Remove the demo and start from a clean design

The included `projects/demo/` is **only an optional worked example**. It is not a required template or source of design defaults. After inspecting the tutorial, delete its directory when starting your own work:

```bash
# macOS / Linux
rm -rf projects/demo
# Windows PowerShell: Remove-Item -Recurse -Force projects/demo
```

**Before deleting it**, create your first own project with an approved `DESIGN.md`: `projects/<slug>/DESIGN.md` → explicit design approval → `manifest.json`, `slides.html`, `slides.css`. Otherwise the viewer will correctly show a “no project” message until one exists. The browser root `/` chooses an existing project automatically; `/?project=<slug>` opens an explicit project. `npm test` uses the first valid project unless you specify `TEST_PROJECT=<slug>`; `npm run verify` can be pointed to `SLIDES_URL=http://127.0.0.1:3400/?project=<slug>`. Old PDFs in ignored `cache/` and reports in ignored `artifacts/` may be deleted safely when no active export is running. **Never delete another project's assets when cleaning the example.**

An approved design does not inherit colors, layout or wording from `projects/demo`. The optional `theme: "editorial-dev"` is used **only when explicitly present** in a project's manifest; projects with no theme use the engine's neutral white/gray standard master. The engine still supplies technical invariants (1920×1080 canvas, PDF/HTML output and bundled Noto Sans KR font), rather than imposing the example's design choices.

## AI-first workflow — design approval is mandatory

1. Ask the agent: **“Create a new presentation. First write `projects/<slug>/DESIGN.md` with audience, goals, visual direction, colors, type scale, slide-by-slide outline and image slots. Do not implement slides until I approve the design.”**
2. Review and approve `DESIGN.md` (or request revisions). Approval is the gate for slide creation.
3. Ask the agent to implement the approved design in `slides.html`, `slides.css`, `manifest.json`. It must follow [`AGENTS.md`](AGENTS.md), preserve stable `data-image-slot` IDs, and leave `engine/` and `server/` untouched.
4. Preview `http://127.0.0.1:3400/?project=<slug>`; insert images in the local browser; use **PDF ↓** to download.
5. Run `npm test` and `SLIDES_URL='http://127.0.0.1:3400/?project=<slug>' npm run verify` and review `artifacts/m5/report.json`.

Project source lives in `projects/<slug>/`. The engine handles a fixed 1920×1080 (16:9) canvas, standard master, browser viewer and PDF print document. No PPTX export or WYSIWYG editor is included.

## Verification

```bash
npm test
npm run verify
```

`npm run verify` captures browser/print screenshots, converts the **real PDF** to PNG with PDF.js, checks dimensions, clipping, images and visual differences, and exits nonzero on errors. The PDF generator validates local Noto Sans KR font loading. Intermediate output lives in ignored `artifacts/` and `cache/`.

To choose a custom browser executable, set `CHROMIUM_PATH`; otherwise `npm run setup:browser` installs Chromium for Playwright on the current machine. A non-default server port can be set using `PORT` and matching `SLIDES_URL` for verification.

## Privacy and security

- `projects/*/assets/` is excluded from Git. Do not publish real screenshots, API tokens or confidential documents.
- Slide HTML is executable browser content. Only open **trusted project content**.
- `npm run dev` uses an upload-protected server. `npm run dev:local` enables uploads **on the loopback interface only** for a trusted workstation.
- Server-side PDF cache invalidates when source content or image slots change. Downloaded PDFs use `Content-Length`; browser button downloads a complete blob for Safari compatibility.
- This is a source-first tool intended to be cloned and used in an editor. macOS and Windows browser-dependent testing should be repeated on target systems before claiming full support.

