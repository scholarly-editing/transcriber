<role>
You are a senior TypeScript/React/CSS engineer working in the muhaqqiq-editor monorepo — a CodeMirror 6-based scholarly text editor with a Rust WASM parser backend.
</role>

<context>
- **Monorepo root:** `/home/mahmoud/WebstormProjects/muhaqqiq-editor`
- **Editor core:** `packages/core/` — framework-agnostic CodeMirror 6 core
- **React wrapper:** `packages/react/` — React component wrapping the core
- **Playground:** `apps/react-playground/` — Storybook demo app

## Current Architecture

### Highlighting Pipeline
- `packages/core/src/editor/extensions/highlight-extension.ts` — Parser-driven `StateField<DecorationSet>` that assigns CSS classes to token spans:
  - `Word` tokens get **split decorations**: edition-symbol characters (prefix `*`, suffix `°`, brackets `{}[]()`) get `.edition-symbol` class; the bare word gets `.token-{state}` class (e.g., `.token-emendation`, `.token-corrupt`)
  - `Tag`, `Error`, `PageBreak`, `Block`, `WordInBlock` each get their own class
- `packages/core/src/style.css` — CSS custom properties (`--muhaqqiq-*`) and classes for all token states

### Lint / Error Pipeline
- `packages/core/src/editor/extensions/lint-extension.ts` — `linter()` extension that maps parser `Error` tokens to CodeMirror `Diagnostic` objects (inline wavy underlines + tooltip messages)
- `packages/core/src/parser/parser-types.ts` — `ITokenizerError`, `ITextError` types
- `packages/core/src/parser/parser-service.ts` — `ParserService.tokenize()` returns `ITokenizeResult` with `tokens[]` and `errors[]` (error indices)

### React Component
- `packages/react/src/Editor.tsx` — `MuhaqqiqEditor` component; supports string-mode and document-mode
- In document-mode: creates a `TranscriptionManager`, mounts CodeMirror, wires up state
- No error display UI currently — errors are only shown as CodeMirror inline diagnostics

### State
- `packages/core/src/state/transcription-state.ts` — `ITranscriptionState` has `errors: string[]` (application-level errors from failed parsing)
- `packages/core/src/core/transcription-manager.ts` — `hasErrors()` checks `state.errors.length`

## Edition Symbol Issue
The `.edition-symbol` CSS class is defined with `color: var(--muhaqqiq-edition-symbol-color)` = `#6e7781` (neutral gray). The split decoration logic in `highlight-extension.ts` correctly separates symbol characters from word characters into non-overlapping ranges. However, when a word has a state class (e.g., `.token-emendation` with blue color), the symbol characters preceding or following it should visually stand out with a distinctly different color — currently the gray may not be prominent enough or the styling may not be applying correctly in context.

## Coding Standards
- **Biome** for linting/formatting (single quotes, 2-space indent, 100 char width, semicolons)
- **Explicit types** for function return types and parameters
- **Interfaces** with `I` prefix, PascalCase
- **Type imports** via `import type { ... }`
- **Explicit `.ts`/`.tsx` extensions** in imports
- **React:** `React.FC<Props>` with arrow functions
- Use the numbered task files in this folder as the execution sequence.
</context>
