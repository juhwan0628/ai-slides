# AI Slides — Example Presentation Design Specification

**Status: APPROVED · implemented**  
**Version:** 2.0 / 2026-10-13  
**Scope:** `projects/demo` only. This document is a design proposal, not permission to implement it.

> **Approval gate.** The AI must present this document for review. Do not edit `slides.html`, `slides.css`, `manifest.json`, shared engine styles or other production code until the user explicitly approves the proposal. Reconfirm if there are material changes to visual direction.

## 1. Product positioning and audience

- **Product:** AI Slides — a source-first presentation engine, controlled by VS Code agents (Codex, Claude Code and similar tools).
- **Audience:** developers familiar with Git, VS Code, HTML/CSS and AI coding agents.
- **Promise:** **Design first. Let the agent build. Present confidently.**
- **Goal of the example:** act as both a genuinely polished product-introduction deck **and** a concise visual tutorial. Show the actual work sequence, without implying there is a graphical slide editor.
- **Length:** six slides, 3–4 minutes; each slide communicates one decision or action.
- **Editorial voice:** confident, restrained, technically concrete. English headline + short Korean explanatory copy. Avoid generic marketing claims, dense instructions or excessive emoji/icons.

## 2. Visual direction

**Concept:** `Developer Tool × Editorial Minimalism` — editorial typography, architectural whitespace, limited code-like details and one accent color.

### Palette (hex, fixed)

| Token | Color | Usage |
|---|---|---|
| `--bg` | `#F7F7F5` | main warm-white slide surface |
| `--ink` | `#171717` | titles and primary content |
| `--muted` | `#666761` | descriptions and metadata |
| `--line` | `#DCDDD7` | hairline rules and restrained dividers |
| `--accent` | `#B8F34B` | one focused emphasis per slide, not large paragraphs |
| `--panel` | `#EEEEEA` | code/output panel and placeholders |
| `--dark` | `#171717` | intentional full-dark section or closing slide |

**Distribution:** roughly 80% warm white, 15% black/gray, 5% electric lime. No teal, gradients, decorative shadows, glossy cards or random additional accent colors. Accent must never be the only signal of importance. On lime backgrounds use near-black text; check contrast for small labels.

### Typography

- **Supported font:** locally bundled `Noto Sans KR Variable`; use existing 400 and 700 weights until font manifest support is implemented. Code snippets use a locally available monospace fallback (`ui-monospace, Menlo, Consolas, monospace`); embedding a specific code font is not yet guaranteed.
- **Hero headline:** 118–150px, weight 700, line-height 1.04–1.12, 1–2 short lines.
- **Section headline:** 76–92px, weight 700, line-height 1.1–1.16.
- **Lead statement:** 38–46px, weight 400–700.
- **Body:** 28–34px, line-height 1.4–1.55; limit to ~2–3 short lines per block.
- **Meta/kicker:** 19–23px, 700, slight tracking; never depend on microscopic text.
- **Code:** 23–28px, monospaced; avoid screenshots of small source text when semantic HTML can render it crisply.
- Prefer actual typographic contrast over all-caps or bolding everything. Korean line breaks should be manually reviewed at 1920×1080.

### Canvas, grid and composition

- **Canonical canvas:** 1920×1080 (16:9), fixed logical pixels. Uniform viewport scaling only; no responsive content reflow.
- **Safe margins:** 120px left/right, at least 90px top/bottom for standalone cover/closing. Minimum gap between major elements 36px.
- **Content grid:** 12 conceptual columns with 24px gutters; common split ratios: 7:5, 6:6, 8:4. Use asymmetric composition, not three identical cards on every slide.
- **Whitespace:** protect at least one strong empty region per slide; no panel unless it conveys content.
- **Shape language:** 1–2px rules, square or 12px corners where useful. Avoid large repeated rounded cards.
- **Motion:** no animations in this example. PDF must show the entire intended state without interaction.
- **Navigation UI:** browser controls are outside the canvas and are not part of the design.

### Header/footer and current engine constraint

The current shared renderer automatically supplies a **blue, 220px-high header** and a **blue-gray footer** to `standard` slides; `cover`/`closing` also use a navy engine background. Those defaults **conflict with this proposal**. Approval of this design should authorize a **small, deliberate theme-aware master implementation** in the common engine so the slide canvas uses the approved palette without CSS specificity hacks in each project. Preserve shared DOM structure, 1920×1080 geometry and PDF parity, and avoid changing the look of unrelated projects without an explicit theme mechanism. Do not silently redesign the engine before approval.

Preferred themed-standard master: compact 20–24px kicker, editorial 76–92px heading, 1px rule, generous content region; a minimal footer (brand/section) in muted gray. Print PDF must not show presentation-player pagination (already a requirement). A cover or closing may intentionally use a dark field.

## 3. Slide-by-slide storyboard (6 slides)

### 01 — Cover: **AI Slides.**
- **Message:** `Design first. Let the agent build.`
- **Layout:** warm-white background; giant left-aligned typographic headline occupying upper-middle left; one lime highlight bar aligned with the baseline of a short phrase; tiny top-left `AI / PRESENTATIONS / 001` metadata; ample negative space on the right.
- **Copy:** headline `AI Slides.`; subtitle `디자인은 사람이 결정하고, 구현은 AI가 맡습니다.`
- **Visual:** typography only — no fake product imagery, no decorative clip art.
- **Proof of quality:** visually distinctive cover, not a generic blue keynote template.

### 02 — Design before code: **First, define the direction.**
- **Message:** no slide markup before design approval.
- **Layout:** large headline in top third; asymmetrical 7:5 split: left with numbered vertical editorial steps (`01 Brief → 02 DESIGN.md → 03 Approve`), right containing a clean code-editor-style `DESIGN.md` excerpt (not a real screenshot).
- **Copy:** `목적과 청중을 정하고, 디자인 시스템과 목차를 승인하세요.`
- **Accent:** lime underline only under `Approve`; design document is the focal artifact.
- **Required fact:** explicit approval gates implementation; do not portray it as automatic.

### 03 — Let the agent build: **The agent writes the slides.**
- **Message:** source files, not a drag-and-drop editor, define the presentation.
- **Layout:** asymmetrical 6:6; left decisive 2–3 lines; right dark code panel with large readable file tree:
  `projects/my-talk/` → `DESIGN.md`, `manifest.json`, `slides.html`, `slides.css`.
- **Copy:** `VS Code에서 지시하면 AI가 HTML·CSS를 작성합니다.`
- **Accent:** one lime file-tree selection marker or line, not lime code everywhere.
- **No misleading UI:** do not suggest a native desktop app, slide editor or actual VS Code extension.

### 04 — Image placement: **Your images. Your control.**
- **Message:** AI reserves image placement; a person chooses actual images.
- **Layout:** narrow left explanatory column (5/12), broad right image-slot demonstration (7/12); actual `data-image-slot="example-screenshot"`, stable across redesigns.
- **Copy:** `슬롯을 클릭해 이미지를 넣으면 웹과 PDF에 동일하게 반영됩니다.`
- **Empty state:** intentional editorial placeholder with concise `DROP IN YOUR IMAGE` label, 16:9 preserved; no inaccurate promise of public-server upload.
- **Note:** on public demo the upload is intentionally blocked; trusted local mode supports it. Mention unobtrusively in a small caption or README.

### 05 — Verify the output: **One source. Two outputs.**
- **Message:** HTML preview and exported PDF should match; real PDF is checked, not guessed.
- **Layout:** side-by-side browser canvas and PDF page drawn as HTML/CSS shapes, with a simple `→` connector or one shared visual focal element. Below: large command `npm run verify`, and understated microcopy `Layout · Fonts · Overflow · PDF raster`.
- **Copy:** `브라우저와 PDF를 자동 비교해 출력 오류를 발견합니다.`
- **No invented metric:** avoid fabricated percentages, speedups or test counts.
- **Visual test:** both output shapes share the same proportions and visual content.

### 06 — Closing: **Clone. Create. Present.**
- **Message:** one short set of commands to start; editing continues in VS Code.
- **Layout:** near-black full-slide background; oversized warm-white headline, lime block for `Present.`; bottom-left short readable code stack `npm ci`, `npm run setup:browser`, `npm run dev`; bottom-right `github.com/juhwan0628/ai-slides`.
- **Copy:** `디자인을 확정했다면, 이제 AI에게 제작을 맡기세요.`
- **No extra CTAs, QR, unrelated branding or external assets.**

## 4. Components and asset policy

- Project content may use editorial steps, code panels, line separators and *one* prominent image slot. Use semantic HTML and project-scoped CSS selectors (`.frame .demo-*`).
- Source images and old hackathon assets are **not** to be copied into this public example. No base64-embedded screenshots or private media.
- Image slot ID `example-screenshot` is already used and **must remain unchanged**; stored images are not committed.
- Browser preview and PDF share the same assets. Image `object-fit: contain` by default; use `cover` only after explicit crop acceptance.
- If the screenshot slot is unfilled, report a warning, not an artificial success claim.

## 5. Build plan (only after explicit approval)

1. Confirm this document is approved. Save a stable approved version / mark status and version.
2. Implement the smallest necessary **theme-aware master** change, with safeguards for other projects. Do not simply override blue header/footer ad hoc.
3. Replace `projects/demo/slides.html` and `slides.css` with the six-page storyboard. Keep `example-screenshot` slot ID.
4. Update tests that intentionally depend on the demo page count or copy; retain generic engine regression tests.
5. Run `npm test`; run `npm run verify` and inspect all `html-*`, `print-*`, `pdf-*` outputs plus actual downloaded PDF. Check desktop and narrow letterboxed viewport behavior.
6. Preview the deployed demo and PDF; report visual inconsistencies and seek user design feedback. No GitHub push before separately requested publication/review.

## 6. Acceptance checklist

- [x] User explicitly approves this design direction and six-slide outline.
- [ ] Covers/editorial standard/closing all use the agreed palette (no inherited blue master showing through).
- [ ] All slides remain readable at canonical 1920×1080; no clipped text or overfull layouts.
- [ ] Accent use is limited and consistent; no generic repeated-card template appearance.
- [ ] Real `example-screenshot` image slot survives redesign.
- [ ] All commands, capabilities and usage instructions are truthful to the repository.
- [ ] `npm test` and PDF raster `npm run verify` pass; only a legitimate empty-slot warning is allowed.
- [ ] Print has exact page count, 16:9 aspect ratio, and no browser player controls/page counter.
- [ ] Public uploads remain blocked; source/asset secrets never appear in Git.

## 7. Decisions requested before implementation

1. **Direction:** warm white / near-black / electric lime — approve or request change?
2. **Theme:** allow a narrow theme-aware shared-master change so demo header/footer can adopt the editorial style while keeping other projects safe?
3. **Copy:** English headlines + Korean explanations; six slides as above — approve or revise?

**Decision: APPROVED by user.** Editorial theme, six-slide structure, and scoped theme-aware shared master were approved and implemented.
