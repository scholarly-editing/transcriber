<role>
You are a senior TypeScript/CodeMirror 6 engineer working in the Muhaqqiq Editor monorepo — a scholarly text editor built on CodeMirror 6 with a WASM parser, React wrapper, and Storybook playground.
</role>

<context>
- **Product goal:** Add an optional hovering toolbar that appears when the user clicks inside the editor. The toolbar displays buttons for every configured edition symbol (prefixes, suffixes, and brackets). Clicking a button inserts/wraps the symbol at the cursor and hides the toolbar. The toolbar also hides when the user starts typing.
- **Monorepo structure:**
  - `packages/core` — Framework-agnostic editor core (CodeMirror 6 extensions, state, parser, processors).
  - `packages/react` — React wrapper component (`MuhaqqiqEditor`).
  - `packages/apm-adapter` — APM adapter models (not touched).
  - `apps/react-playground` — Storybook demo app.
- **Key files:**
  - `packages/core/src/core/models/config.model.ts` — `IEditorConfig` interface (word, prefix, suffix, brackets, tags, blocks, pages, theme, editingEnabled, highlightingEnabled).
  - `packages/core/src/editor/editor-setup.ts` — `createConfiguredSetup(config)` assembles extensions (cleanup, highlight, lint, keymap) based on config flags.
  - `packages/core/src/editor/extensions/keymap-extension.ts` — Contains `insertSymbol()` and `wrapWithBrackets()` helpers for inserting/wrapping text at the cursor.
  - `packages/core/src/editor/extensions/highlight-extension.ts` — Edition-symbol highlighting via `StateField` + parser tokenizer.
  - `packages/core/src/core/transcription-manager.ts` — Orchestrator: uses `Compartment` for hot-reloading `createConfiguredSetup`, theme, and editable extensions.
  - `packages/core/src/index.ts` — Public exports barrel.
  - `packages/core/src/style.css` — CSS custom properties for token colors.
  - `apps/react-playground/src/stories/Editor.stories.tsx` — Storybook stories.
  - `apps/react-playground/src/stories/sample-data/configs.ts` — Sample `ARABIC_CONFIG` and `LATIN_CONFIG`.
- **Coding standards (from AGENTS.md):**
  - Biome for linting/formatting (single quotes, semicolons, 2-space indent, 100-char line width).
  - Explicit types for function return types and parameters.
  - Interfaces prefixed with `I` for object shapes.
  - `import type` for type-only imports.
  - Arrow functions for React components.
  - CodeMirror extensions exported as factory functions: `createXxxExtension(config)`.
  - CSS custom properties prefixed with `--muhaqqiq-`.
  - No `console.log` in packages (allowed in playground).
- **CodeMirror tooltip API (from `@codemirror/view`):**
  - `showTooltip: Facet<Tooltip | null>` — Facet to show/hide tooltips.
  - `Tooltip` interface: `{ pos: number, end?: number, create(view) → TooltipView, above?: boolean, arrow?: boolean }`.
  - `TooltipView` interface: `{ dom: HTMLElement, mount?(view), update?(update), destroy?() }`.
  - `StateField.define<Tooltip | null>` with `provide: field => showTooltip.from(field)` to drive tooltip display.
  - `StateEffect.define<T>()` for show/hide signals.
  - `EditorView.domEventHandlers({ mouseup })` to listen for clicks.
  - The toolbar extension should **not** use `hoverTooltip` (that's mouse-hover); it should use `showTooltip` facet with manual state management.
- **Edition symbols in config:**
  - `config.prefix?: IPrefixConfig[]` — Single-char prefix symbols (e.g., `†` corrupt, `*` emended, `?` unclear, `!` sic). Insert at cursor.
  - `config.suffix?: ISuffixConfig[]` — Single-char suffix symbols (e.g., `°` abbreviated). Insert at cursor.
  - `config.brackets?: IBracketsConfig[]` — Paired markers (e.g., `[[ ]]` supplied, `[ ]` lacuna, `{ }` editorial). Wrap selection or insert pair.
- **Existing `insertSymbol` / `wrapWithBrackets` helpers** in `keymap-extension.ts` — reuse or extract to a shared utility.
- **Verification expectations:** `pnpm -r tsc --noEmit` passes, `pnpm check` passes, Storybook renders the toolbar correctly.
- Use the numbered task files in this folder as the execution sequence.
</context>
